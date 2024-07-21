import Tours from "./Tours";
const Home = () => {
  return (
    <>
      <Tours />
      <div className="py-8 w-full flex flex-col bg-slate-200 dark:bg-slate-700 px-6 md:px-32 md:pt-16 md:pb-32">
        <h3 className="self-center font-bold text-xl md:text-4xl">
          Why choose us???
        </h3>
        <hr className="w-[15%]  h-0.5 rounded-md self-center mt-5 mb-10 bg-yellow-500 border-none md:mt-8 md:mb-24 md:h-1 md:w-20" />
        <div className="flex flex-col gap-20 md:flex-row md:gap-5">
          <div className="self-center flex flex-col gap-2 md:gap-6">
            <img
              className="self-center w-16 h-16 mb-2 md:w-24 md:h-24 md:mb-8"
              src="./icons/planning.png"
              alt=""
            />
            <h5 className="self-center font-bold text-md md:text-2xl">
              Expertly crafted itineraries
            </h5>
            <p className="text-center text-sm md:mx-10 md:text-lg md:font-semibold ">
              Whether you are captivated by the historic wonders or craving
              vibrant atmosphere of Addis Ababa, our meticulously designed
              itineraries cater to every traveler&apos;s interests and
              preferences.
            </p>
          </div>
          <div className="self-center flex flex-col gap-2 md:gap-6">
            <img
              className="self-center w-16 h-16 mb-2 md:w-24 md:h-24 md:mb-8"
              src="./icons/local.png"
              alt=""
            />
            <h5 className="self-center font-bold text-md md:text-2xl">
              Local Expertise
            </h5>
            <p className="text-center text-sm md:mx-10 md:text-lg md:font-semibold">
              Our team of local guides and experts bring unparalleled knowledge
              and passion to every journey, offering insider perspectives on
              Ethiopia&apos;s culture, history and natural wonders.
            </p>
          </div>
          <div className="self-center flex flex-col gap-2 md:gap-6">
            <img
              className="self-center w-16 h-16 mb-2 md:w-24 md:h-24 md:mb-8"
              src="./icons/bus.png"
              alt=""
            />
            <h5 className="self-center font-bold text-md md:text-2xl">
              Sustainable travel
            </h5>
            <p className="text-center text-sm md:mx-10 md:text-lg md:font-semibold">
              We prioritize responsible tourism practices, ensuring that your
              visit not only enriches your experiances but also supports local
              communities and preserves Ethiopia&apos;s enviroment and heritage.
            </p>
          </div>
        </div>
      </div>
      <div className="py-8 w-full flex flex-col bg-[url('./images/land.jpg')] text-white px-6 md:px-32 md:pt-16 md:pb-32">
        <h3 className="self-center font-bold text-xl md:text-4xl">Ethiopia</h3>
        <hr className="w-[15%]  h-0.5 rounded-md self-center mt-5 mb-10 bg-yellow-500 border-none md:mt-8 md:mb-24 md:h-1 md:w-20" />
        <div className="flex flex-col gap-20 md:flex-row md:gap-5">
          <p className="text-md md:text-xl md:text-center md:leading-9">
            Ethiopia is often referred to as the &quot;cradle of humanity&quot;
            is a land of ancient wonders and natural splendor that beckons
            travelers seeking adventure and cultural immersion. The country is
            home to numerous UNESCO World Heritage Sites, including Lalibela
            with its astonishing rock-hewn churches, Axum with its towering
            obelisks, and Gondar&apos;s royal castles dating back to the 17th
            century. {}
            <p>
              In addition to its historical sites, Ethiopia boasts a wealth of
              natural beauty. The Simien Mountains, a UNESCO-recognized national
              park, offer breathtaking vistas and opportunities for trekking
              amidst endemic wildlife such as the Ethiopian wolf and gelada
              baboon. The Danakil Depression, one of the hottest and lowest
              places on Earth, presents an otherworldly landscape of bubbling
              lava lakes and salt flats, offering intrepid travelers a glimpse
              into the Earth&apos;s geological wonders. Moreover,
              Ethiopia&apos;s cuisine is a highlight in itself. Known for its
              unique flavors and diverse dishes, Ethiopian food, such as injera
              (a sourdough flatbread) served with spicy stews (wats), offers a
              culinary adventure that tantalizes the taste buds and reflects the
              country&apos;s agrarian heritage.{" "}
            </p>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
