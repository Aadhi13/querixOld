import React, { useEffect } from "react";
import styled from "styled-components";
import Analytics from "./Analytics";
import FAQ from "./FAQ"
import Navbar from "./Navbar";
import scrollreveal from "scrollreveal";
import { useDispatch } from "react-redux";
import { getAdminData } from "../../../redux/features/admin/adminDataSlice"

export default function Dashboard() {
  const dispatch = useDispatch();
  dispatch(getAdminData());

  useEffect(() => {
    console.log('useEffect for scroll reveal started working')
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
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
        interval: 100,
      }
    );
  }, []);


  return (
    <div>
      <Section>
        <Navbar />
        <div className="grid">
          <div className="row__one">
            <Analytics />
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