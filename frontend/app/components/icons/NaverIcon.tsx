export default function NaverIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" fill="white" rx="8"/>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 12H22.5L28.5 23.5V12H36V36H25.5L19.5 24.5V36H12V12Z"
        fill="currentColor"
      />
    </svg>
  );
}
