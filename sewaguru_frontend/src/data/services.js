import homeRepairImg from "../assets/services/home-repair.jpg";
import cleaningImg from "../assets/services/cleaning.jpg";
import applianceImg from "../assets/services/appliance.jpg";
import securityImg from "../assets/services/security.jpg";
import movingImg from "../assets/services/moving.jpg";
import gardenImg from "../assets/services/garden.jpg";

const serviceData = {
    "Home Service & Repairs": {
        image: homeRepairImg,
        description: "Professional help for all your household repair needs — from plumbing leaks to electrical fixes and handyman support, we’ve got your home covered.",
        subServices: [
            "Plumbing (leaks, fittings, drainage)",
            "Electrical Repairs (wiring, sockets, switches)",
            "Carpentry (furniture fixing, hinge alignment)",
            "Masonry & Tile Work (tile fixing, wall repair)",
            "Door & Window Repair",
            "Curtain Rod / Shelf Installation"
        ]
    },
    "Cleaning & Pest Control": {
        image: cleaningImg,
        description: "Keep your space clean and pest-free with our professional cleaning and pest control services.",
        subServices: [
            " Deep Cleaning",
            "Kitchen & Bathroom Cleaning",
            "Sofa & Mattress Cleaning",
            "Carpet & Curtain Cleaning",
            "Termite Control",
            "Cockroach / Ant / Bed Bug Control"
        ]
    },
    "Appliance Repair & Installation": {
        image: applianceImg,
        description: "Get your appliances installed or repaired by certified SewaGuru technicians.",
        subServices: [
            "AC Repair & Installation",
            "Washing Machine Repair",
            "Refrigerator Repair",
            "Microwave / Oven Setup",
            "TV Wall Mounting"
        ]
    },
    "Home Security & Smart Solutions": {
        image: securityImg,
        description: "Secure your home with CCTV installation and smart automation solutions.",
        subServices: [
            "CCTV Installation",
            "Smart Doorbell Setup",
            "Video Intercom Installation",
            "Alarm System Installation",
            "Smart Lock Installation",
            "Motion Sensor Setup",
            "Wi-Fi Router / IoT Configuration"
        ]
    },
    "Moving & Transport": {
        image: movingImg,
        description: "Efficient and reliable moving, packing, and transportation services.",
        subServices: [
            "House Shifting",
            "Office Relocation",
            "Furniture Transport",
            "Mini Truck Booking",
            "Packing & Unpacking Services",
            "Loading & Unloading Help"
        ]
    },
    "Tree & Garden Services": {
        image: gardenImg,
        description: "Professional tree care and gardening services to keep your outdoors beautiful and safe.",
        subServices: [
            "Lawn Mowing",
            "Tree Trimming / Pruning",
            "Garden Cleaning",
            "Planting & Maintenance",
            "Outdoor Pest Control",
            "Landscaping Services",
            "Fertilizer & Soil Treatment"
        ]
    }
};

export default serviceData;