import React from "react";
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";

export default function Navbar() {
  return (
    <Nav >
      <div className="w-full flex flex-col sm:flex-row justify-between">
        <div className="titleNav">
          <h5 className="text-lg xs:text-xl sm:text-2xl">Hi Admin,</h5>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl">
            Welcome to <span>Querix </span>
          </h1>
        </div>
        {/* sm:w-[3px] md:w-[14rem] lg:w-[17rem] ml:w-[14rem] xl:w-[20rem] */}
        {/* <div className="search mt-8 sm:mt-0 w-[8rem] ml:w-[14rem] lg:w-[17rem] xl:w-[20rem]"> */}
        {/* <div className="flex items-center flex-row search mt-8 sm:mt-0 sm:w-auto w-[240px]">
          <BiSearch className="text-2xl flex-shrink-0 " />
          <input type="text" placeholder="Search" className="text-[#ffc107] sm:hidden md:block md:w-[7rem] lg:w-[10rem] ml:w-[12rem] xl:w-[14rem]" />
        </div> */}
      </div>
    </Nav>
  );
}
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  color: white;
  body{
    background: black;
  }
  .titleNav {
    h1 {
      span {
        color: #ffc107;
        font-family: "Permanent Marker", cursive;
        letter-spacing: 0.2rem;
      }
    }
    margin-top:0rem;
  }
  .search {
    background-color: #212121;
    gap: 1rem;
    height: 4rem;
    padding: 1rem 1rem 1rem 1rem;
    border-radius: 1rem;
    svg {
      color: #ffc107;
    }
    input {
      background-color: transparent;
      font-family: "Permanent Marker", cursive;
      letter-spacing: 0.3rem;
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: #ffc107;
        font-family: "Permanent Marker", cursive;
      }
    }
  }
  // @media screen and (min-width: 280px) and (max-width: 1080px) {
  //   }
  // }
`;