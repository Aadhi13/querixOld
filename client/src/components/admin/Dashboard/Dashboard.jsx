import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Analytics from "./Analytics";
import Navbar from "./Navbar";
import scrollreveal from "scrollreveal";
import { useDispatch } from "react-redux";
import { getAdminData } from "../../../redux/features/admin/adminDataSlice"
import BarChart from "../Chart/BarChart";
import { UserData } from "../Chart/Data";
import LineChart from "../Chart/LineChart";
import PieChart from "../Chart/PieChart";

export default function Dashboard() {
  const dispatch = useDispatch();
  dispatch(getAdminData());
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [{
      label: "Users Gained",
      data: UserData.map((data) => data.userGain),
      backgroundColor: ['black', 'gray', 'red', 'blue',]
    }]
  })


  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "150px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(`
            nav,
            .row__one,
            .row__two
        `,
      {
        opacity: 0,
        interval: 500,
      }
    );
  }, []);


  return (
    <div>
      <Section className="justi item">
        <Navbar />
        <div className="grid">
          <div className="row__one">
            <Analytics />
            <div className="text-white border w-[800px] bg-red-200">
              <h1 className="text-2xl">Chart & Graph</h1>
              <BarChart chartData={userData}/>
              <LineChart chartData={userData}/>
              <PieChart chartData={userData}/>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

const Section = styled.section`
  margin-left: 18vw;
  padding: 3rem;
  height: 100%;
  .grid {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
    margin-top: 2rem;
    .row__one {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      height: 50%;
      gap: 1rem;
    }
    .row__two {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      height: 50%;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 1080px) {
    margin-left: 0;
    .grid {
      .row__one,
      .row__two {
        grid-template-columns: 1fr;
      }
    }
  }
`;