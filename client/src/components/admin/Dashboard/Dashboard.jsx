import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Analytics from "./Analytics";
import Navbar from "./Navbar";
import scrollreveal from "scrollreveal";
import { useDispatch } from "react-redux";
import { getAdminData } from "../../../redux/features/admin/adminDataSlice"
import SimpleLineChart from "../Chart/SimpleLineChart";
import axios from "../../../api/axios";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  dispatch(getAdminData());

  useEffect(() => {
    console.log('useEffect');
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin');
        if (!token) {
          dispatch(getAdminData());
        } else {
          console.log(token, 'to000ekn');
          const res = (await axios.get("/admin/trending-data", {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            withCredentials: true,
          }));
          console.log(res.data.data, 'res.data.data');
          setData(res.data.data)
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [])

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
            <div className="flex mt-14 items-center gap-12">
              <div className="w-[920px] flex justify-center items-center">
                <div className="absolute z-10 left-[845px] text-white flex flex-col gap-10 ml-auto">
                  <button className={`${days == 7 ? 'bg-[#ffc107] text-black' : 'bg-[#000000] hover:bg-[#ffc107] hover:text-black'} py-1 px-1.5 rounded-md font-medium`} onClick={() => setDays(7)}>7</button>
                  <button className={`${days == 10 ? 'bg-[#ffc107] text-black' : 'bg-[#000000] hover:bg-[#ffc107] hover:text-black'} py-1 px-1.5 rounded-md font-medium`} onClick={() => setDays(10)}>10</button>
                  <button className={`${days == 30 ? 'bg-[#ffc107] text-black' : 'bg-[#000000] hover:bg-[#ffc107] hover:text-black'} py-1 px-1.5 rounded-md font-medium`} onClick={() => setDays(30)}>30</button>
                  <button className={`${days == 60 ? 'bg-[#ffc107] text-black' : 'bg-[#000000] hover:bg-[#ffc107] hover:text-black'} py-1 px-1.5 rounded-md font-medium`} onClick={() => setDays(60)}>60</button>
                </div>
                <div className="relative z-0">
                  <SimpleLineChart days={days} />
                </div>
              </div>
              <div className="w-[500px] h-[535px] text-white">
                <h1 className="text-3xl text-center my-5">Trending</h1>
                <div className="bg-gray-800 text-xl p-5 gap-10 flex flex-col">
                  <ul>Question</ul>
                  <ul>Question</ul>
                  <ul>Question</ul>
                  <ul>Question</ul>
                  <ul>Question</ul>
                  <ul>Question</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section >
    </div >
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