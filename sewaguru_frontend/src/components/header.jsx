import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="bg-[#48B8E3] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="SewaGuru Logo" className="w-auto h-auto max-h-16 " />
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6 text-base">
          <a href="#home" className="hover:text-[#FDCB02] transition">Home</a>
          <a href="#services" className="hover:text-[#FDCB02] transition">Services</a>
          <a href="#about" className="hover:text-[#FDCB02] transition">About</a>
          <a href="#contact" className="hover:text-[#FDCB02] transition">Contact</a>
        </nav>

        {/* CTA Button */}
        <a
          href="#book"
          className="bg-[#FDCB02] text-[#1F2937] font-semibold py-2 px-4 rounded-xl hover:bg-yellow-400 transition"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}
