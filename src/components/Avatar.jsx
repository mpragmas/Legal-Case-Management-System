export function Avatar({ initials, size = "md", className = "" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
    xl: "h-20 w-20 text-2xl",
  };
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary-600 text-white font-bold shrink-0 ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
