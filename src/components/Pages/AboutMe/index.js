import React,{useContext} from "react";
import ConImage from "../../Banner/connectImage";
import MyContext from "../../MyContext";


const  AboutMe =() =>{
    const theme = useContext(MyContext);
    console.log("this is the log from aboutme page",theme)
    return (
        <div className={theme === "dark" ? "dark-margin" : "light-margin"}>
            <ConImage />
            <div className={`content_container ${theme === "dark" ? "dark" : "light"}`}>
                <div className="novel_content">
                    <h3>CONTACT ME</h3>
                    <h4>联系方式</h4>
                    <p>cheerli1989@gmail.com</p>
                </div>
            </div>
        </div>
   )
};

export default AboutMe;

