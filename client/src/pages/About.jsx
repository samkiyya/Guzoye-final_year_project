// import aboutImg from "../assets/images/about_img.png";
import { Link, useNavigate } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

const About = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/contact-us");
  };
  return (
    <div className="w-full flex flex-col justify-center mt-10 md:mt-16">
      <div className="w-[90%] self-center rounded-xl shadow-xl p-3 flex flex-col gap-10 sm:px-9 md:w-[83%] md:px-24">
        <h1 className="self-center font-bold text-base md:text-4xl md:mb-6 md:underline">
          About us
        </h1>
        <div className="flex flex-col my-5 md:flex-row md:py-16">
          <img
            // src={aboutImg}
            src="/icons/about.png"
            className="w-32 h-32 self-center md:w-48 md:h-48"
            alt="Image"
          />
          <div className="md:mx-12">
            <h1 className="text-2xl text-center font-semibold mt-6 mb-2 md:mb-6">
              Who we are???
            </h1>
            <p className="text-base text-center md:text-left md:mx-16">
              Welcome to Guzoye web-app, your premier gateway to the
              extraordinary world of Ethiopian tourism. Nestled in the heart of
              East Africa, Ethiopia beckons travelers with its unparalleled mix
              of natural beauty, ancient history, and vibrant culture.{" "}
              <p className="hidden sm:inline">
                We are passionate about showcasing the best that Ethiopia has to
                offer, ensuring every visitor experiences the magic of this
                diverse land.
              </p>
            </p>
          </div>
        </div>
        <hr className="w-5 h-1 self-center bg-green-400 rounded" />
        <div className="flex flex-col my-5 md:flex-row md:py-16">
          <img
            src="./icons/handshake 3.png"
            className="w-32 h-32 self-center md:w-48 md:h-48 md:order-2"
            alt="Image"
          />
          <div className="md:mx-12 md:order-1">
            <h1 className="text-2xl text-center font-semibold mt-6 mb-2 md:mb-6">
              Our Commitment
            </h1>
            <p className="text-base text-center md:text-left md:mx-16">
              Founded with a dedication to sustainable tourism practices, Guzoye
              is committed to preserving Ethiopia&apos;s natural environment and
              cultural heritage.{" "}
              <p className="hidden sm:inline">
                We collaborate closely with local communities, employing
                knowledgeable guides who provide authentic insights into
                Ethiopia&apos;s rich traditions and history. By supporting local
                businesses and initiatives, we aim to foster economic growth
                while preserving the unique charm that makes Ethiopia such a
                captivating destination.
              </p>
            </p>
          </div>
        </div>
        <hr className="w-5 h-1 self-center bg-green-400 rounded" />
        <div className="flex flex-col my-5 md:flex-row md:py-16">
          <img
            src="./icons/choice.png"
            className="w-32 h-32 self-center md:w-48 md:h-48"
            alt="Image"
          />
          <div className="md:mx-12 md:w-full">
            <h1 className="text-2xl text-center font-semibold mt-6 mb-2 md:mb-6">
              Why Choose Us?
            </h1>
            <p className="text-base text-left md:text-left md:mx-16">
              <ul>
                <li>- Expert Guidance</li>
                <li>- Customized Itineraries</li>
                <li>- Ethical Tourism</li>
                <li>- 24/7 Support</li>
              </ul>
            </p>
          </div>
        </div>
        <hr className="w-5 h-1 self-center bg-green-400 rounded" />
        <div className="flex flex-col my-5 md:flex-row md:py-16">
          <img
            src="./icons/search 3.png"
            className="w-32 h-32 self-center md:w-48 md:h-48 md:order-2"
            alt="Image"
          />
          <div className="md:mx-12 md:order-1">
            <h1 className="text-2xl text-center font-semibold mt-6 mb-2 md:mb-6">
              Discover Ethiopia with Us
            </h1>
            <p className="text-base text-center md:text-left md:mx-16">
              Whether you&apos;re a first-time visitor or a seasoned traveler,
              Guzoye invites you to embark on a journey of discovery across
              Ethiopia&apos;s diverse landscapes and cultural tapestry.{" "}
              <p className="hidden sm:inline">
                Explore the ancient monolithic churches of Lalibela, witness the
                geological wonders of the Danakil Depression, or savor the
                flavors of Ethiopian cuisine in Addis Ababa&apos;s bustling
                markets.Join us in unlocking the secrets of Ethiopia, where
                every adventure is a blend of history, nature, and warm
                hospitality.
                <Link to="">Contact us</Link> today to start planning your next
                unforgettable journey to this remarkable country.
              </p>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-100 bg-gradient-to-r from-purple-500 to-pink-500 mt-10 px-5 py-5 self-center flex flex-col sm:py-10 md:px-32 md:py-16">
        <p className="md:text-2xl md:font-semibold">Get in touch</p>
        <ul className="list-disc w-max mx-10 my-5 md:mx-24 md:mt-8 md:mb-16">
          <li className="hover:underline hover:text-blue-600 cursor-pointer">
            <a
              className="flex items-center gap-2 md:text-base"
              href="https://github.com/samkiyya"
              target="_blank"
            >
              Git-Hub <FaExternalLinkAlt />
            </a>
          </li>
          <li className="hover:underline hover:text-blue-600 cursor-pointer">
            <a
              className="flex items-center gap-2 md:text-base"
              href="https://www.instagram.com/samkiyya/"
              target="_blank"
            >
              Instagram <FaExternalLinkAlt />
            </a>
          </li>
        </ul>
        <button
          onClick={handleRedirect}
          className="border-none shadow-md shadow-stone-600 w-[50%] py-2 bg-green-400 rounded-lg text-center self-center hover:bg-green-600 sm:w-[25%] md:text-2xl md:w-64 md:py-4 md:drop-shadow-lg"
        >
          Contact us
        </button>
      </div>
    </div>
  );
};

export default About;
