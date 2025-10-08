export default function KakaoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 10C14.059 10 6 16.268 6 24C6 28.803 9.035 33.016 13.622 35.39L11.908 42.447C11.784 42.936 12.294 43.33 12.717 43.069L20.934 38.141C22.585 38.379 24.278 38.5 26 38.5C35.941 38.5 44 32.232 44 24.5C44 16.768 35.941 10.5 26 10.5L24 10Z"
        fill="currentColor"
      />
    </svg>
  );
}
