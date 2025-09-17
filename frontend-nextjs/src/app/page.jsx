import React from "react";
import Header from "./components/Header";
import SpecialityMenu from "./components/SpecialityMenu";
import TopProfessionals from "./components/TopProfessionals";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopProfessionals />
    </div>
  );
};

export default Home;
