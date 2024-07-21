export default function Contact() {
  return (
    <>
      <div className="w-full flex flex-col bg-[url('./images/bg_jmg1.jpg')] px-6 py-12 md:py-24">
        <p className="font-semibold text-center text-base mb-8 md:text-4xl">
          How was your experience?
        </p>
        <div className=" bg-white self-center dark:bg-slate-900 shadow-2xl border-none p-6 rounded-lg md:w-[35%] md:p-12">
          <form className="flex flex-col">
            <label htmlFor="email" className="mb-2 md:mb-4 md:text-xl">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-8 rounded-md mb-5 bg-slate-200 dark:bg-slate-600 border-none md:h-14 md:text-xl md:mb-10"
            />
            <label htmlFor="message" className="mb-2 md:mb-5 md:text-xl">
              Message
            </label>
            <textarea
              id="message"
              className="w-full h-24 rounded-md mb-5 bg-slate-200 dark:bg-slate-600 border-none md:h-40 md:text-xl md:mb-10"
            ></textarea>
            <button className="w-full h-10 bg-yellow-500 rounded-md hover:bg-green-300 md:h-14 md:text-xl">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
