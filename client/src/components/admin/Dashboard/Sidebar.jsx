import React, { useState } from "react";
import styled from "styled-components";
import { MdSpaceDashboard } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { GiTwirlCenter, GiHamburgerMenu } from "react-icons/gi";
import { BsFillChatTextFill } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import { HiUsers } from "react-icons/hi";
import { AiOutlineTag } from "react-icons/ai";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { message } from 'antd';
import { useNavigate } from 'react-router-dom'
import '../../../assets/styles/admin/adminSidebar.css';
import { useDispatch } from "react-redux";
import { getAdminData } from "../../../redux/features/admin/adminDataSlice";


export default function Sidebar(props) {
  const { defaultCurrentLink } = props;
  const navigate = useNavigate()
  const [currentLink, setCurrentLink] = useState(defaultCurrentLink || 1);
  const [navbarState, setNavbarState] = useState(false);
  const html = document.querySelector("html");
  html.addEventListener("click", () => setNavbarState(false));

  const dispatch = useDispatch();
  dispatch(getAdminData());

  //logout function
  const handleLogout = (e) => {
    localStorage.removeItem("admin")
    navigate('/admin/signin');
    message.success("Logout successfully")
  }

  return (
    <>
      <Section>
        <div className="top">
          <div className="brand">
            <img className="img1" src="https://res.cloudinary.com/dmvxmurxw/image/upload/v1674275344/d290aeb183e04eb79aff0417bcffaf57_4_ij8pl4.png" alt="" />
            <span>Querix</span>
          </div>
          <div className="toggle">
            {navbarState
              ? (
                <VscChromeClose onClick={() => setNavbarState(false)} />)
              : (
                <GiHamburgerMenu
                  onClick={(e) => {
                    e.stopPropagation();
                    setNavbarState(true);
                  }}
                />)
            }
          </div>
          <div className="links">
            <ul>
              <li className={currentLink === 1 ? "active" : "none"} onClick={() => setCurrentLink(1)}>
                <a onClick={() => { navigate('/admin/') }} >
                  <div ><MdSpaceDashboard style={{ width: "25px" }} /></div>
                  <span className="buttonsDashboard"  > Dashboard</span>
                </a>
              </li>
              <li className={currentLink === 2 ? "active" : "none"} onClick={() => setCurrentLink(2)} >
                <a onClick={() => { navigate('/admin/user-manage') }}>
                  <div><HiUsers style={{ width: "25px" }} /></div>
                  <span className="buttonsDashboard"   > Users</span>
                </a>
              </li>
              <li className={currentLink === 3 ? "active" : "none"} onClick={() => setCurrentLink(3)} >
                <a onClick={() => { navigate("/admin/question-manage") }}>
                  <div><AiOutlineTag style={{ width: "25px" }} /></div>
                  <span className="buttonsDashboard" > Questions</span>
                </a>
              </li>
              <li className={currentLink === 4 ? "active" : "none"} onClick={() => setCurrentLink(4)} >
                <a onClick={() => { navigate('/admin/reported-question-manage') }}>
                  <div> <FaAddressCard style={{ width: "25px" }} /></div>
                  <span className="buttonsDashboard" > Reported Questions</span>
                </a>
              </li>
              <li className={currentLink === 5 ? "active" : "none"} onClick={() => setCurrentLink(5)} >
                <a onClick={() => { navigate('/admin/reported-answer-manage') }}>
                  <div> <GiTwirlCenter style={{ width: "25px" }} /></div>
                  <span className="buttonsDashboard" > Reported Answers</span>
                </a>
              </li>
              <li className={currentLink === 6 ? "active" : "none"} onClick={() => setCurrentLink(6)} >
                <a onClick={() => { navigate('/admin/reported-comments-manage') }}>
                  <div> <BsFillChatTextFill style={{ width: "25px" }} /></div>
                  <span className="buttonsDashboard" > Reported Comments</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="logout">
          <RiLogoutCircleRLine style={{ color: "#fff", fontSize: "24px" }} onClick={handleLogout} values="Logout" />
        </div>
      </Section>
      <ResponsiveNav navstate={navbarState.toString()} className={navbarState ? "show" : ""}>
        <div className="responsive__links">
          <ul>
            <li className={currentLink === 1 ? "active" : "none"} onClick={() => setCurrentLink(1)} >
              <a onClick={() => { navigate('/admin/') }}>
                <div ><MdSpaceDashboard style={{ width: "20px" }} /></div>
                <span> Dashboard</span>
              </a>
            </li>
            <li className={currentLink === 2 ? "active" : "none"} onClick={() => setCurrentLink(2)} >
              <a onClick={() => { navigate('/admin/user-manage') }}>
                <div><HiUsers style={{ width: "20px" }} /></div>
                <span className="buttonsDashboard"   > Users</span>
              </a>
            </li>
            <li className={currentLink === 3 ? "active" : "none"} onClick={() => setCurrentLink(3)} >
              <a onClick={() => { navigate('/admin/question-manage') }}>
                <div> <FaAddressCard style={{ width: "25px" }} /></div>
                <span className="buttonsDashboard" > Questions</span>
              </a>
            </li>
            <li className={currentLink === 4 ? "active" : "none"} onClick={() => setCurrentLink(4)} >
              <a onClick={() => { navigate('/admin/reported-question-manage') }}>
                <div> <FaAddressCard style={{ width: "20px" }} /></div>
                <span className="buttonsDashboard" > Reported Questions</span>
              </a>
            </li>
            <li className={currentLink === 5 ? "active" : "none"} onClick={() => setCurrentLink(5)} >
              <a onClick={() => { navigate("/admin/reported-answer-manage") }}>
                <div><GiTwirlCenter style={{ width: "20px" }} /></div>
                <span> Reported Answers</span>
              </a>
            </li>
            <li className={currentLink === 6 ? "active" : "none"} onClick={() => setCurrentLink(6)} >
              <a onClick={() => { navigate("/admin/reported-comments-manage") }}>
                <div><AiOutlineTag style={{ width: "25px" }} /></div>
                <span className="buttonsDashboard" > Reported Comments</span>
              </a>
            </li>
            <li className={currentLink === 7 ? "active" : "none"} onClick={() => setCurrentLink(7)} >
              <a onClick={() => { navigate('/admin/logout') }}>
                <div> <RiLogoutCircleRLine style={{ width: "25px", color: "white", cursor: "pointer" }} /></div>
                <span onClick={handleLogout} className="buttonsDashboard" > Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </ResponsiveNav>

    </>
  );
}

const Section = styled.section`
  position: fixed;
  left: 0;
  background-color: #212121;
  height: 100vh;
  width: 18vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;
  .top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    .toggle {
      display: none;
    }
    .buttonsDashboard{
      cursor:pointer;
    } 
    .brand {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      svg {
        color: #ffc107;
        font-size: 2rem;
      }
      span {
        font-size: 2rem;
        color: #ffc107;
        font-family: "Permanent Marker", cursive;
      }
    }
    .links {
      display: flex;
      justify-content: center;
      ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        li {
          border-radius: 0.6rem;
          &:hover {
            background-color: #ffc107;
            a {
              color: black;
            }
          }
          a {
            padding: 0.6rem 1rem;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 1rem;
            color: white;
          }
        }
        .active {
          background-color: #ffc107;
          a {
            color: black;
          }
        }
      }
    }
  }

  .logout {
    padding: 0.3rem 1rem;
    border-radius: 0.6rem;
    &:hover {
      background-color: #da0037;
    }
    a {
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: white;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 1080px) {
    position: initial;
    width: 100%;
    height: max-content;
    padding: 1rem;
    .top {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      .toggle {
        display: block;
        color: white;
        z-index: 99;
        svg {
          font-size: 1.4rem;
        }
      }
      .brand {
        gap: 1rem;
        justify-content: flex-start;
      }
    }
    .top > .links,
    .logout {
      display: none;
    }
  }
`;

const ResponsiveNav = styled.div`
  position: fixed;
  right: -10vw;
  top: 0;
  z-index: 10;
  background-color: black;
  height: 100vh;
  width: ${({ navstate }) => (navstate ? "60%" : "0%").toString()};
  transition: 0.4s ease-in-out;
  display: flex;
  opacity: 0;
  visibility: hidden;
  padding: 1rem;
  .responsive__links {
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 3rem;
      li {
        border-radius: 0.6rem;
        &:hover {
          background-color: #ffc107;
          a {
            color: black;
          }
        }
        a {
          padding: 0.6rem 1rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: white;
        }
      }
      .active {
        background-color: #ffc107;
        a {
          color: black;
        }
      }
    }
  }
`;