import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { message } from "antd"
import { apiForgotPassword, apiVerifyOtp, apiResetPassword } from "@/apis"
import { Button } from "@/components/index"
import { RESPONSE_STATUS } from "@/utils/responseStatus"

const ForgotPassword = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const [email, setEmail] = useState("")
  const [currentStep, setCurrentStep] = useState("email") // email, otp, reset
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [tempToken, setTempToken] = useState("")

  // Watch password for confirmation validation
  const newPassword = watch("password")

  // Create refs for each OTP input
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  // Handle countdown timer
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleForgotPassword = async (data) => {
    try {
      setLoading(true)
      const emailToUse = data?.email || email
      if (!emailToUse) {
        message.error("Vui lòng nhập email")
        setLoading(false)
        return
      }

      setEmail(emailToUse)
      const response = await apiForgotPassword({ email: emailToUse })

      if (response.statusCode !== RESPONSE_STATUS.SUCCESS) {
        message.info(response?.message)
      } else {
        message.success("Mã OTP đã được gửi, vui lòng nhập OTP")
        setCurrentStep("otp")
        setCountdown(60) // Start 60s countdown
        // Reset OTP values when requesting a new OTP
        setOtpValues(["", "", "", "", "", ""])
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi yêu cầu")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return // Prevent resending if countdown is active

    try {
      setLoading(true)
      const response = await apiForgotPassword({ email })

      if (response.statusCode !== RESPONSE_STATUS.SUCCESS) {
        message.info(response?.message)
      } else {
        message.success("Mã OTP mới đã được gửi")
        setCountdown(60) // Reset countdown
        // Reset OTP values when requesting a new OTP
        setOtpValues(["", "", "", "", "", ""])
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi lại OTP")
    } finally {
      setLoading(false)
    }
  }

  // Focus the first input when OTP screen shows
  useEffect(() => {
    if (currentStep === "otp" && otpRefs[0].current) {
      otpRefs[0].current.focus()
    }
  }, [currentStep])

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    // Update the OTP values array
    const newOtpValues = [...otpValues]
    newOtpValues[index] = value
    setOtpValues(newOtpValues)

    // Auto-focus to next input if value is entered
    if (value && index < 5) {
      otpRefs[index + 1].current.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace - move to previous input
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current.focus()
    }

    // Handle left arrow key
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs[index - 1].current.focus()
    }

    // Handle right arrow key
    if (e.key === "ArrowRight" && index < 5) {
      otpRefs[index + 1].current.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted content is numeric and has appropriate length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split("")

      // Fill in as many inputs as we have digits
      const newOtpValues = [...otpValues]
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtpValues[index] = digit
          if (otpRefs[index].current) {
            otpRefs[index].current.value = digit
          }
        }
      })

      setOtpValues(newOtpValues)

      // Focus on the next empty input or the last input
      const focusIndex = Math.min(digits.length, 5)
      if (otpRefs[focusIndex].current) {
        otpRefs[focusIndex].current.focus()
      }
    }
  }

  const handleVerifyOtp = async () => {
    const otpString = otpValues.join("")

    // Validate OTP is complete
    if (otpString.length !== 6) {
      message.error("Vui lòng nhập đầy đủ mã OTP 6 số")
      return
    }

    try {
      setLoading(true)
      const response = await apiVerifyOtp(email, otpString)
      if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
        message.success("Xác minh OTP thành công, vui lòng đặt lại mật khẩu")
        setTempToken(response.data?.tempToken)
        setCurrentStep("reset")
      } else {
        message.error("Mã OTP không hợp lệ")
        setOtpValues(["", "", "", "", "", ""])
        // Focus first input after reset
        if (otpRefs[0].current) {
          otpRefs[0].current.focus()
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xác minh OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (data) => {
    try {
      setLoading(true)
      const response = await apiResetPassword({
        token: tempToken,
        newPassword: data.password,
        confirmPassword: data.confirmPassword
      })

      if (response.statusCode !== RESPONSE_STATUS.SUCCESS) {
        if (response.message.toLowerCase().includes('jwt expired')) {
          message.info("Đã hết thời gian đặt lại mật khẩu, vui lòng thực hiện lại")
          setCurrentStep("email")
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại sau")
        }
      } else {
        message.success("Đổi mật khẩu thành công")
        onClose()
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt lại mật khẩu")
    } finally {
      setLoading(false)
    }
  }

  const renderEmailStep = () => (
    <>
      <h2 className="text-xl font-semibold mb-2">Quên mật khẩu</h2>
      <label htmlFor="email" className="text-gray-700">
        Nhập email của bạn
      </label>
      <input
        type="email"
        id="email"
        className="w-full p-3 border border-gray-300 outline-none rounded placeholder:text-sm"
        placeholder="youremail@email.com"
        onChange={(e) => setEmail(e.target.value)}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        })}
      />
      {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      <Button fw={true} handleOnClick={handleSubmit(handleForgotPassword)} disabled={loading}>
        {loading ? "Đang xử lý..." : "Xác nhận"}
      </Button>
    </>
  )

  const renderOtpStep = () => (
    <>
      <h2 className="text-xl font-semibold mb-2">Xác minh OTP</h2>
      <label htmlFor="otp" className="text-gray-700 mb-2">
        Nhập mã OTP đã gửi tới <span className="font-medium">{email}</span>
      </label>

      <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>
        {otpValues.map((value, index) => (
          <input
            key={index}
            ref={otpRefs[index]}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            value={value}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      <Button fw={true} handleOnClick={handleVerifyOtp} disabled={loading}>
        {loading ? "Đang xử lý..." : "Xác minh OTP"}
      </Button>

      <div className="text-sm text-gray-600 mt-2 flex justify-center">
        {countdown > 0 ? (
          <p className="text-gray-500">
            Gửi lại OTP sau <span className="font-semibold">{countdown}</span> giây
          </p>
        ) : (
          <button
            className="text-blue-600 hover:underline"
            onClick={handleResendOtp}
            disabled={loading || countdown > 0}
          >
            Gửi lại OTP
          </button>
        )}
      </div>
      <button
        className="text-blue-600 hover:underline text-sm mt-2"
        onClick={() => setCurrentStep("email")}
        disabled={loading}
      >
        Thay đổi email
      </button>
    </>
  )

  const renderResetPasswordStep = () => (
    <>
      <h2 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="block text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            id="password"
            className="w-full p-3 border border-gray-300 rounded mt-1 outline-none"
            {...register("password", {
              required: 'Vui lòng nhập mật khẩu',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
              },
              maxLength: {
                value: 50,
                message: 'Mật khẩu không được quá 50 ký tự',
              },
            })}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full p-3 border border-gray-300 rounded mt-1 outline-none"
            {...register("confirmPassword", {
              required: 'Vui lòng xác nhận mật khẩu',
              validate: value => value === newPassword || 'Mật khẩu không khớp',
            })}
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
        </div>
        <Button fw={true} handleOnClick={handleSubmit(handleResetPassword)} disabled={loading}>
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </div>
    </>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "email":
        return renderEmailStep()
      case "otp":
        return renderOtpStep()
      case "reset":
        return renderResetPasswordStep()
      default:
        return renderEmailStep()
    }
  }

  return (
    <div className="absolute animate-fade-in top-0 left-0 bottom-0 right-0 bg-overlay flex flex-col items-center justify-center py-8 z-50">
      <div className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {renderCurrentStep()}
        <button
          className="w-full text-gray-700 hover:text-blue-700 hover:underline cursor-pointer mt-2"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword