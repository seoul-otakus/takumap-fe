import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-300">Made by</span>
            서울오타쿠들
            <Heart
              size={16}
              className="text-red-400 fill-red-400 animate-pulse"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="px-3 py-1 bg-primary/10 rounded-full">
              TAKUMAP
            </span>
            <span>© 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
