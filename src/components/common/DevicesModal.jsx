import { Modal } from "antd"
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function DevicesModal({ open, onClose, devices = [] }) {
  const currentDevice = devices.find(device => device.isCalledDevice);
  const otherDevices = devices.filter(device => !device.isCalledDevice);

  return (
    <Modal
      title="Thiết bị đã đăng nhập"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ maxHeight: "60vh", overflow: "hidden" }}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Danh sách các thiết bị đã đăng nhập vào tài khoản của bạn
        </p>

        <div style={{ maxHeight: "calc(60vh - 120px)", overflowY: "auto", paddingRight: "8px" }}>
          {[currentDevice, ...otherDevices].map(device => 
            device && ( // Kiểm tra null vì currentDevice có thể undefined
              <div key={device.deviceHash} className="border rounded-md p-4 mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {device.deviceInfo}
                      {device.isCalledDevice && (
                        <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                          Thiết bị hiện tại
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      <div>
                        Đăng nhập từ{" "}
                        {formatDistanceToNow(new Date(device.loginTime), { addSuffix: true, locale: vi })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Modal>
  );
}