export interface INotificationProps {
  key: React.Key;
  message: React.ReactNode;
  description?: React.ReactNode;
  btn?: React.ReactNode;
  onClose?: () => void;
  duration?: number;
}
