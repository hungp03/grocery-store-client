import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Button, Input, Modal, message } from "antd"
import { apiRequestDeactivateAccount, apiDeactivateAccount } from "@/apis"
import path from "@/utils/path"
import { RESPONSE_STATUS } from "@/utils/responseStatus"
import { logout } from "@/store/user/userSlice"

export default function OtpVerificationModal({ open, onClose }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [step, setStep] = useState("confirmation")
  const [countdown, setCountdown] = useState(0)

  // Create refs for each input
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  // Handle countdown timer
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleProceedToOtp = async () => {
    try {
      setLoading(true)
      const response = await apiRequestDeactivateAccount()
      if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
        setStep("otp")
        message.success("OTP đã được gửi đến email của bạn")
        setCountdown(60) 
      } else {
        message.error(response.message || "Có lỗi xảy ra khi gửi OTP")
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    // Check if OTP is complete
    if (otp.some((digit) => digit === "")) {
      message.error("Vui lòng nhập đầy đủ mã OTP 6 chữ số")
      return
    }

    setLoading(true)
    const otpValue = otp.join("")

    const response = await apiDeactivateAccount({ otpCode: otpValue })

    if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
      message.success("Thao tác thành công")
      setOtp(["", "", "", "", "", ""])
      setStep("confirmation")
      onClose()
      dispatch(logout())
      setTimeout(() => {
        navigate(path.LOGIN)
      }, 1000)
    } else {
      message.error(response.message || "Có lỗi xảy ra khi xác thực OTP")
      setOtp(["", "", "", "", "", ""])
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setOtp(["", "", "", "", "", ""])
    setStep("confirmation")
    onClose()
  }

  const handleInputChange = (e, index) => {
    const { value } = e.target

    // Only allow numeric input
    if (!/^\d*$/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    // Move focus to next input if current input is filled
    if (value && index < 5) {
      inputRefs[index + 1].current.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // If current field is empty and backspace is pressed, move to previous field
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs[index - 1].current.focus()
      } else if (otp[index] !== "") {
        // If current field has a value, clear it
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    }

    // Handle left arrow key
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current.focus()
    }

    // Handle right arrow key
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1].current.focus()
    }
  }

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted content is numeric and has appropriate length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split("")
      const newOtp = [...otp]

      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit
      })

      setOtp(newOtp)

      // Focus the next empty field or the last field if all are filled
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
      if (nextEmptyIndex !== -1) {
        inputRefs[nextEmptyIndex].current.focus()
      } else if (digits.length < 6) {
        inputRefs[digits.length].current.focus()
      } else {
        inputRefs[5].current.focus()
      }
    }
  }

  const renderConfirmationStep = () => (
    <div className="py-4">
      <p className="mb-6">Bạn chắc chắn muốn vô hiệu hóa tài khoản của mình?</p>
      <p className="text-gray-500 mb-6">Chúng tôi sẽ gửi mã OTP xác thực đến email của bạn để hoàn tất quá trình.</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="primary" onClick={handleCancel}>
          Hủy
        </Button>
        <Button danger onClick={handleProceedToOtp}>
          Tiếp tục
        </Button>
      </div>
    </div>
  )

  const handleResendOtp = async () => {
    if (countdown > 0) return // Prevent resending if countdown is active

    try {
      setLoading(true)
      const response = await apiRequestDeactivateAccount()
      if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
        message.success("OTP mới đã được gửi đến email của bạn")
        setCountdown(60) // Reset countdown
      } else {
        message.error(response.message || "Có lỗi xảy ra khi gửi lại OTP")
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi lại OTP")
    } finally {
      setLoading(false)
    }
  }

  const renderOtpStep = () => (
    <div className="py-2">
      <p className="mb-4">Vui lòng nhập mã OTP 6 chữ số đã được gửi đến email của bạn để xác thực.</p>

      <div className="my-6">
        <label className="block text-sm font-medium mb-2">Nhập mã OTP 6 chữ số</label>
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              className="w-12 h-12 text-center text-lg"
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              autoComplete={index === 0 ? "one-time-code" : "off"}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 text-center">
        {countdown > 0 ? (
          <p className="text-gray-500">
            Gửi lại OTP sau <span className="font-semibold">{countdown}</span> giây
          </p>
        ) : (
          <Button type="link" onClick={handleResendOtp} loading={loading && countdown === 0} disabled={countdown > 0}>
            Gửi lại OTP
          </Button>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={handleCancel}>Hủy</Button>
        <Button type="primary" onClick={handleVerify} loading={loading}>
          Xác nhận
        </Button>
      </div>
    </div>
  )

  // Reset OTP fields when step changes to "otp"
  useEffect(() => {
    if (step === "otp") {
      setOtp(["", "", "", "", "", ""])
      // Focus the first input field after a short delay
      setTimeout(() => {
        if (inputRefs[0].current) {
          inputRefs[0].current.focus()
        }
      }, 100)
    }
  }, [step])

  return (
    <Modal
      title={step === "confirmation" ? "Xác nhận" : "Xác thực OTP"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      {step === "confirmation" ? renderConfirmationStep() : renderOtpStep()}
    </Modal>
  )
}

