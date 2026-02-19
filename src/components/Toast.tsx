interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 bg-bg-card border border-success text-success px-5 py-3 rounded-[10px] text-[13px] font-medium z-[100] pointer-events-none transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
      }`}
    >
      {message}
    </div>
  );
}
