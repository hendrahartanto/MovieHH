import cinemaBanner from "@/assets/cinema-banner.jpg";

const HomePage = () => {
  return (
    <div>
      <img
        className="absolute top-0 left-0 brightness-60"
        src={cinemaBanner}
        alt=""
      />
      {/* <div>this is home page</div> */}
    </div>
  );
};

export default HomePage;
