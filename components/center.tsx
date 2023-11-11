export default function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {children}
    </div>
  );
}
