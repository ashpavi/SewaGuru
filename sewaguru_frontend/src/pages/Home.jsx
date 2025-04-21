
import { Button } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import {
  FaBroom,
  FaPaintRoller,
  FaPlug,
  FaLeaf,
  FaTruckMoving,
  FaToilet,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="w-full">


      {/* Hero Section with Search */}
        <section className="bg-gray-100 w-full py-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
            {/* Left: Text + Search */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold text-blue-700 leading-tight">
                We provide <br />
                <span className="text-black">quality service</span>
              </h1>
              <p className="text-lg text-gray-700">We work 24 hours a day to serve your home needs.</p>

              {/* Search Bar */}
              <div className="flex w-full max-w-md border rounded-xl overflow-hidden shadow-md">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="flex-1 px-4 py-2 outline-none"
                />
                <Button color="info" className="flex items-center gap-2 rounded-none">
                  <HiSearch className="text-lg" />
                  Search
                </Button>
              </div>

              {/* Contact/CTA */}
              <div className="flex items-center gap-4 text-sm text-gray-600 pt-4">
                <div className="flex items-center gap-2"><FaMapMarkerAlt />
                126/2A, Main Street, Homagama
                </div>
                <div className="flex items-center gap-2"><FaPhoneAlt />
                +94 77 002 1234
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="flex justify-center">
              <img
                src="/Hero 1.jpg"
                alt="Hero Worker"
                className="w-full max-w-md md:max-w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

      

            
            {/* Services Icons */}
      
          <section className="py-10 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 md:grid-cols-6 gap-6 text-center text-sm text-gray-700">
              {[ 
                { icon: <FaBroom size={30} />, label: "Cleaning" },
                { icon: <FaToilet size={30} />, label: "Plumbing" },
                { icon: <FaPlug size={30} />, label: "Electrician" },
                { icon: <FaPaintRoller size={30} />, label: "Painting" },
                { icon: <FaLeaf size={30} />, label: "Gardening" },
                { icon: <FaTruckMoving size={30} />, label: "Moving" },
              ].map((service, i) => (
                <div key={i} className="flex flex-col items-center gap-2 transition duration-300 transform hover:scale-105 hover:opacity-90">
                  <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center shadow-md">
                    {service.icon}
                  </div>
                  <span>{service.label}</span>
                </div>
              ))}
            </div>
          </section>


      {/* Popular Services Near You */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h4 className="text-xl font-semibold mb-4">Popular Services Near You</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["AC Repair", "Pest Control", "Packers & Movers", "Home Cleaning", "CCTV Setup", "Car Wash"].map((service, i) => (
              <div key={i} className="bg-lime-100 text-center px-4 py-3 rounded-lg shadow-sm font-medium">
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Based Services */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h4 className="text-xl font-semibold mb-6">Subscription Based Services</h4>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-lime-100 rounded-xl overflow-hidden shadow-md">
                <img
                  src={`https://placehold.co/600x300?text=Plan+${item}`}
                  alt={`Plan ${item}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h5 className="text-lg font-semibold mb-2">Popular Plan - LKR 2,500/month</h5>
                  <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
                    <li>3 home visits / month</li>
                    <li>Emergency support</li>
                    <li>20% discount on additional services</li>
                  </ul>
                  <Button color="warning">Learn More</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h4 className="text-xl font-semibold mb-6">See what happy customers are saying about SewaGuru</h4>
          <div className="grid md:grid-cols-2 gap-6">
            {["Elizabeth", "Ehsan"]?.map((name, i) => (
              <div
                key={i}
                className="bg-gray-100 p-5 rounded-xl shadow-md text-sm text-gray-800"
              >
                <p className="mb-2">“Great experience! They arrived on time and completed the work flawlessly.”</p>
                <div className="font-semibold">{name} ⭐⭐⭐⭐⭐</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

