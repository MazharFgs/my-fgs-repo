/*!
 * Copyright 2023, Staffbase GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React,  { useState, ReactElement, useEffect } from "react";
import { BlockAttributes, WidgetApi, SBUserProfile } from "widget-sdk";
import axios from "axios";
/**
 * React Component
 */
const urlPeopleDirectory = 'https://my.fgsglobal.com/content/page/65ccc99094a9e16a1bbe1146';
const url ="https://myfgs-staffbase-storyblok-proxy-btg6wh5qh-fgh-global.vercel.app/api/";
export interface MyFgsBioPageProps extends BlockAttributes {
  widgetApi: WidgetApi;
}

export const MyFgsBioPage = ({ widgetApi }: MyFgsBioPageProps): ReactElement | null => {
  const [user, setUser] = useState<SBUserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userData, setUserData] = useState([]);
  
  const [userBio, setUserBio] = useState("");
  const [useratFgs, setUserAtFgs] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [locations, setLocation] = useState("");
  const [sectors, setSectors] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [praticeArea, setPracticeArea] = useState([]);
  const [lifePreFgs, setLifePreFgs] = useState("");
  const [lifeBeyondFgs, setLifebeyondFgs] = useState("");
  const [hobbies, setHobbies] = useState([]);

  


  useEffect(() => {
    widgetApi.getUserInformation().then((user) => {
      setUser(user);
      verifyToken(user);
    });
  }, []);
  

  useEffect(() => {
    if (isLoggedIn) {
      // localStorage.setItem("view_profile_email", "dan.stone@fgsglobal.com");
      const bioEmail = localStorage.getItem("view_profile_email");
      // const bioEmail = "dan.stone@fgsglobal.com"
      // console.log("User logged in succcessfully" , bioEmail);
      if(bioEmail){
        handleUserDetails({email:bioEmail});
      }
      //   fetchPeopleDirectoryUsers();
    }
  }, [isLoggedIn]);

  const verifyToken = (info) => {
    const checkDirectoryAuthToken = localStorage.getItem("directoryAuthToken");
    if (checkDirectoryAuthToken) {
      const verifyToken = JSON.stringify({
        userId: info?.externalID,
        // userId: "00uwskbw25UJUbQfl1t7",
        token: checkDirectoryAuthToken,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${url}auth/verify`,
        headers: {
          "Content-Type": "application/json",
        },
        data: verifyToken,
      };

      axios
        .request(config)
        .then((response) => {
          if(response.data.success){
            // console.log(JSON.stringify(response.data));
            setIsLoggedIn(true);
          }else{
            authenticateUser(info);
          }
         
        })
        .catch((error) => {
          authenticateUser(info);
          // console.log(error);
        });
    } else {
      authenticateUser(info);
    }
  };

  const authenticateUser = (info) => {
    const data = JSON.stringify({
      userId: info?.externalID,
      // userId: "00uwskbw25UJUbQfl1t7",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url:`${url}auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        localStorage.setItem(
          "directoryAuthToken",
          response.data.token
        );

        localStorage.setItem(
          "loggedEmail",
          response.data.email
        );
        setIsLoggedIn(true);
      })
      .catch((error) => {
        // console.log(error);
      });
  };
 

  const handleUserDetails = ({email}) => {
    // console.log("email", email)
    const checkDirectoryAuthToken = localStorage.getItem("directoryAuthToken");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${url}profiles/${email}`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": checkDirectoryAuthToken
   
      },
    };
    axios
    .request(config)
    .then((response) => {
      // console.log("response" , response)
      setUserData(response.data.data);
      if(Object.keys(response.data.data.storyblokResolves).length > 0){
          
          const location = Object.values(response.data.data.storyblokResolves?.location)
         const t= location.map((e)=>{
            return Object.keys(e)

          })
          setLocation(t.join(", "))
          
      setUserBio(response.data.data.storyblokResolves?.full_bio)
      setUserAtFgs(response.data.data.storyblokResolves?.life_at_fgs_global)

      setLifePreFgs(response.data.data.storyblokResolves?.life_pre_fgs_global)
      setLifebeyondFgs(response.data.data.storyblokResolves?.life_beyond_fgs_global)
      setHobbies(response.data.data.storyblokResolves?.hobbies)

      // sectors

      const sec = Object.values(response.data.data.storyblokResolves?.sectors)
      const scct= sec.map((e)=>{
         return Object.keys(e)

       })
      //  console.log("scct" , scct)
       setSectors(scct)

       const cap = Object.values(response.data.data.storyblokResolves?.capabilities)
      const scap= cap.map((e)=>{
         return Object.keys(e)

       })
     
       setCapabilities(scap)


       const prac = Object.values(response.data.data.storyblokResolves?.practice_areas)
       const sprac= prac.map((e)=>{
          return Object.keys(e)
 
        })
      
        setPracticeArea(sprac)
 
       


      


    }

      if( Object.keys(response.data.data?.storyblokData).length > 0){


      if(Object.keys(response.data.data?.storyblokData).length > 0){

        setImageUrl(response.data.data?.storyblokData?.content?.image.filename)

      }
    }


      // console.log(":...." , Object.keys(response.data.data?.storyblokData?.internal_bio).length)

      // setUserData(response.data.data)
   
    })
    .catch((error) => {
    });
  }





  return <div className="main-bio-div">
    {isLoggedIn && Object.keys(userData).length > 0 ? 
    <div className="bio-container" style={{ display: "flex", flexWrap: "wrap" }}>
      <div className="hero-image" style={{ width: "100%", float: "left" }}>
        <span className="hero-backlink"> <a className="hero-href" href={urlPeopleDirectory}> &lt; Back </a>  </span>
        <div className="hero-firstname">
          {userData?.firstName} {userData?.lastName}
        {/* {userData?.firstName} {{userData?.lastName}} */}
        
        </div>
        <div className="hero-title">
        { Object.keys(userData?.hr_title).length == 0 ?  '' :  userData?.hr_title}
        </div>
         
      </div>
      <div className="after-hero-image" style={{ width: "100%", float: "left" }}>

    <div className="bio-first-section" style={{ width: "65%", float: "left" }}>
    <div className="bio-first-section-inner-div">
      <div className="bio-first-section-inner-div-bio-text">
      <div className="bio-first-section-inner-div-bio-text-title">
          Bio
      </div>
      <div className="bio-first-section-inner-div-bio-text-para">

        {userBio.split("/n").map(function(item, idx) {
        return (
            <span key={idx}>
                {item}
                <br/>
                <br/>
            </span>
         )
    })
}


      </div>
      </div>
      <div className="bio-first-section-inner-div-bio-text">
      <div className="bio-first-section-inner-div-bio-text-title">
          Life at Fgs Global
      </div>
      <div className="bio-first-section-inner-div-bio-text-para">
       {useratFgs}

      </div>
      </div>
      <div className="bio-first-section-inner-div-bio-text">
      <div className="bio-first-section-inner-div-bio-text-title">
          Capabilities
      </div>
      <div className="bio-first-section-inner-div-bio-dropdown">
       {/* {useratFgs} */}

       {capabilities.length > 0 ?
        capabilities.map((e)=>{
         return <div className="bio-dropdown-select">{e} </div>
            
        })
        :""
        }

       

      </div>
      </div>
      
      <div className="bio-first-section-inner-div-bio-text">
      <div className="bio-first-section-inner-div-bio-text-title">
          Sectors
      </div>
      <div className="bio-first-section-inner-div-bio-dropdown">
        {sectors.length > 0 ?
        sectors.map((e)=>{
         return <div className="bio-dropdown-select">{e} </div>
            
        })
        :""
        }
       {/* {useratFgs} */}

      </div>
      </div>
      <div className="bio-first-section-inner-div-bio-text">
      <div className="bio-first-section-inner-div-bio-text-title">
          Practice Area
      </div>
      <div className="bio-first-section-inner-div-bio-dropdown">

      {praticeArea.length > 0 ?
        praticeArea.map((e)=>{
         return <div className="bio-dropdown-select">{e} </div>
            
        })
        :""
        }


      

       {/* {useratFgs} */}

      </div>
      </div>
      <div className="bio-first-section-inner-div-bio-text">
      <div className="bio-first-section-inner-div-bio-text-title">
          Hobbies
      </div>
      <div className="bio-first-section-inner-div-bio-dropdown">

      {hobbies.length > 0 ?
        hobbies.map((e)=>{
         return <div className="bio-dropdown-select">{e} </div>
            
        })
        :""
        }


      
       {/* {useratFgs} */}

      </div>
      </div>
      <div className="bio-first-section-inner-div-life-gfs">
      
      </div>

      </div>
      

    </div>
    <div className="bio-second-section" style={{ width: "35%", float: "left" }}>
    <div className="bio-second-section-image">
    { imageUrl == "" ?<img className="bio-profile-img-custom-widget"
                  src={
                    "https://cdn-de1.staffbase.com/eyo-live-de/image/upload/w_166,h_237/c_limit,w_2000,h_2000/v1706792579/OUEOcGLz7i4q2k6tYK6OoNaTKHZrPrL0tARdTSMzo6Q8IAt2JkDsEG10i3g2TC52fsfFW3uRqzVAEWsCJmIS7MvDoF0JVNu5lepOFphe5ZyIWzI9WWR9ysgapfnUxE2tmfYR8Ab10OpReGxtm0Pd4gdTFfGyxzuEv3d2oBFNKWxjqs1bsFBF0VhDpqQdfmTP/Card-ImgPeople.png"
                  }
                  height="300"
                  width="300"
                /> : <img
                className="bio-profile-img-custom-widget"
                src={imageUrl
                }
                height="300"
                width="300"
              /> }
    
    </div>
    <div className="bio-second-section-inner-div-bio-text">
      <div className="bio-second-section-inner-div-bio-text-title">
          Contant Info
      </div>
      <div className="bio-second-section-inner-div-bio-text-para">
      E: <a href={`mailto:${userData.email[0].value}`}>{userData.email[0].value}</a>
 
      </div>
      <div className="bio-second-section-inner-div-bio-text-para">

      L: {locations}
      
      </div>

      <div className="bio-second-section-inner-div-bio-text-title">
          Business Development Contact For 
      </div>
      <div className="bio-second-section-inner-div-bio-text-para">
      
      </div>

      <div className="bio-second-section-inner-div-bio-text-title">
          Life Pre FGS Global
      </div>
      <div className="bio-second-section-inner-div-bio-text-para">
       {lifePreFgs}
      </div>

      <div className="bio-second-section-inner-div-bio-text-title">
          Life Beyond FGS Global
      </div>
      <div className="bio-second-section-inner-div-bio-text-para">
       {lifeBeyondFgs}
      </div>
      
      </div>
      </div>
      
    
    </div>

    </div> : 'loading....'}


{/* <div className="Wrapper" style="width: 1578px; height: 891px; position: relative; background: #F7EADF">
  <div className="MyfgsWidgetboxonly" style="width: 1578px; height: 230px; left: 0px; top: 0px; position: absolute; opacity: 0; background: #381551; border-bottom: 0.50px #DED4CC solid"></div>
  <div className="Container" style="left: 149px; top: 88px; position: absolute; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
    <div className="ContainerPage" style="height: 1623.76px; padding-left: 80px; padding-right: 80px; background: white; box-shadow: 2px 2px 6px 1px rgba(154, 105, 77, 0.08); border-top-left-radius: 8px; border-top-right-radius: 8px; border: 0.25px #DED4CC solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
      <div className="Heroimg" style="width: 1280px; height: 280px; border-top-left-radius: 8px; border-top-right-radius: 8px; overflow: hidden; justify-content: center; align-items: center; display: inline-flex">
        <div className="GroupHeroImages" style="width: 1280px; height: 433.80px; position: relative">
          <div className="AboutUs" style="width: 1280px; height: 433.80px; left: 0px; top: 0px; position: absolute">
            <div className="Rectangle17" style="width: 1280px; height: 433.80px; left: 0px; top: 0px; position: absolute; background: linear-gradient(253deg, #2D5453 0%, #39383D 100%)"></div>
            <div className="Group4" style="width: 1280px; height: 433.80px; left: 0px; top: 0px; position: absolute">
              <img className="ScreenShot20220325At12361" style="width: 1280px; height: 433.80px; left: 0px; top: 0px; position: absolute" src="https://via.placeholder.com/1280x434" />
              <img className="Rubrics3cubesOpen2" style="width: 2339.10px; height: 2167.33px; left: -1003.45px; top: -1075.22px; position: absolute" src="https://via.placeholder.com/2339x2167" />
              <img className="Rubrics3cubesOpen1" style="width: 2649.04px; height: 2454.28px; left: -436.66px; top: -525.80px; position: absolute" src="https://via.placeholder.com/2649x2454" />
              <div className="Rectangle103" style="width: 1280px; height: 433.80px; left: 0px; top: 0px; position: absolute; opacity: 0.20; background: #2D5453"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="PageHeader" style="align-self: stretch; height: 280px; padding-top: 88px; padding-bottom: 88px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <div className="BackLink" style="padding-top: 8px; padding-bottom: 8px; justify-content: flex-start; align-items: center; gap: 5px; display: inline-flex">
          <div className="ChevronLeft" style="width: 14px; height: 14px; padding-top: 3.25px; padding-bottom: 3.75px; justify-content: center; align-items: center; display: flex">
            <div className="Vector3" style="width: 7px; height: 3.50px; transform: rotate(90deg); transform-origin: 0 0; border: 1px #F1F1F1 solid"></div>
          </div>
          <div className="ChancesAreWeHave" style="color: #F1F1F1; font-size: 14px; font-family: FK Grotesk; font-weight: 300; line-height: 20px; word-wrap: break-word">Back</div>
        </div>
        <div className="Title" style="width: 922px; color: white; font-size: 50px; font-family: Bw Beto; font-weight: 300; line-height: 42px; word-wrap: break-word">Sarah Von Der Heidersch</div>
        <div className="DesignationGroup" style="padding-top: 12px; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
          <div className="Designation" style="width: 478px; color: white; font-size: 24px; font-family: FK Grotesk; font-weight: 300; line-height: 30px; word-wrap: break-word">Director, Design & Creativity</div>
        </div>
      </div>
      <div className="PageBody" style="padding-top: 64px; padding-bottom: 120px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <div className="ViewprofileBody" style="align-self: stretch; justify-content: flex-start; align-items: flex-start; gap: 96px; display: inline-flex">
          <div className="Viewprofileleft" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 40px; display: inline-flex">
            <div className="MyfgsViewprofileBlock" style="height: 254px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
              <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Bio</div>
              <div className="Text" style="align-self: stretch; color: #111111; font-size: 16px; font-family: FK Grotesk; font-weight: 300; line-height: 22px; word-wrap: break-word">Michael provides strategic communications counsel to clients across many industries during times of crisis and profound change. Regardless of the issue or assignment, Michael applies a holistic approach to his work by creating tailored and comprehensive communications strategies that engage a company’s or organization’s internal and external stakeholders.<br />At FGS Global, Michael uses his background as a former practicing attorney to guide clients through litigations and restructurings that have been the subject of intense public interest and has helped companies navigate through periods of transformation and reorganization.</div>
            </div>
            <div className="MyfgsVewprofileText" style="align-self: stretch; height: 110px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
              <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Life at FGS Global</div>
              <div className="Text" style="align-self: stretch; color: #111111; font-size: 16px; font-family: FK Grotesk; font-weight: 300; line-height: 22px; word-wrap: break-word">Provides tailored and comprehensive strategic communications counsel to clients across many industries during times of crisis and profound change, including litigations, restructurings and organizational transformations.</div>
            </div>
            <div className="MyfgsViewprofileTags" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
              <div className="Frame457856" style="height: 73px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 5px; display: flex">
                <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Capabilities</div>
                <div className="IconText" style="align-self: stretch; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Strategy & Reputation</div>
                  </div>
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Government Affairs, Policy & Advocacy</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="MyfgsViewprofileTags" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
              <div className="Frame457856" style="height: 73px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 5px; display: flex">
                <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Sectors</div>
                <div className="IconText" style="align-self: stretch; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Financial Services</div>
                  </div>
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Retail & Consumer Goods</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="MyfgsViewprofileTags" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
              <div className="Frame457856" style="height: 73px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 5px; display: flex">
                <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Practice Areas</div>
                <div className="IconText" style="align-self: stretch; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Transaction & Financial Communication</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="MyfgsViewprofileTags" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
              <div className="Frame457856" style="height: 73px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 5px; display: flex">
                <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Hobbies</div>
                <div className="IconText" style="align-self: stretch; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Reading</div>
                  </div>
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Writing</div>
                  </div>
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Watching</div>
                  </div>
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Swimming</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Viewprofileright" style="width: 360px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 36px; display: inline-flex">
            <div className="Peoplepic" style="width: 360px; height: 438.76px; position: relative">
              <img className="SarahB1" style="width: 360px; height: 438.76px; left: 0px; top: 0px; position: absolute; border-radius: 5px" src="https://via.placeholder.com/360x439" />
              <img className="SarahB2" style="width: 420.41px; height: 511.99px; left: -24.43px; top: -34.78px; position: absolute; border-radius: 5px" src="https://via.placeholder.com/420x512" />
            </div>
            <div className="Peoplecontact" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 5px; display: flex">
              <div className="Peopletitle" style="width: 152px; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Contact Info</div>
              <div className="EEnquiriesUsFghCom" style="width: 267px"><span style="color: #2D5453; font-size: 16px; font-family: FK Grotesk; font-weight: 300; line-height: 22px; word-wrap: break-word">E. </span><span style="color: #636DCC; font-size: 16px; font-family: FK Grotesk; font-weight: 300; line-height: 22px; word-wrap: break-word">enquiries-us@fgh.com</span></div>
              <div className="LNewYorkUnitedStates" style="width: 283px"><span style="color: #2D5453; font-size: 16px; font-family: FK Grotesk; font-weight: 300; line-height: 22px; word-wrap: break-word">L. </span><span style="color: #39383D; font-size: 16px; font-family: FK Grotesk; font-weight: 300; line-height: 22px; word-wrap: break-word">New York, United States</span></div>
            </div>
            <div className="MyfgsViewprofileTags" style="width: 360px; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
              <div className="Frame457856" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 5px; display: inline-flex">
                <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Business Development Contact for</div>
                <div className="IconText" style="width: 358px; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Digital Marketing</div>
                  </div>
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Market Research</div>
                  </div>
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Analytical Thinking</div>
                  </div>
                  <div className="MyfgsViewprofiletags" style="padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; background: #E5F3F4; border-radius: 2px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                    <div className="SanFransisco" style="color: #2D5453; font-size: 14px; font-family: FK Grotesk; font-weight: 400; line-height: 24px; word-wrap: break-word">Social Media Management</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="MyfgsViewprofileBlock" style="align-self: stretch; height: 144px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
              <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Life Pre-FGS Global</div>
              <div className="Text" style="align-self: stretch; color: #111111; font-size: 16px; font-family: FK Grotesk; font-weight: 300; line-height: 22px; word-wrap: break-word">Guided the Jewish Community Relations Council of New York through crises.<br />Worked as an associate at two top law firms, including Weil, Gotshal & Manges.</div>
            </div>
            <div className="MyfgsViewprofileBlock" style="align-self: stretch; height: 110px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
              <div className="Label" style="align-self: stretch; color: #767676; font-size: 16px; font-family: Bw Beto; font-style: italic; font-weight: 300; line-height: 36px; word-wrap: break-word">Life Beyond FGS Global</div>
              <div className="Text" style="align-self: stretch; color: #111111; font-size: 16px; font-family: FK Grotesk; font-weight: 300; line-height: 22px; word-wrap: break-word">Always ready for a good story in any form. When not traveling, planning his next trip with his wife and three children in Westchester, NY.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="PageFooter" style="height: 120px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
        <div className="MyfgsFooter" style="width: 1126px; height: 120px; padding-left: 240px; padding-right: 240px; flex-direction: column; justify-content: flex-end; align-items: center; display: flex">
          <div className="Frame457886" style="align-self: stretch; flex: 1 1 0; background: rgba(255, 255, 255, 0.16); border-top: 1px #DED4CC solid; flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: flex"></div>
        </div>
      </div>
    </div>
    <div className="ContainerFooter" style="height: 112px; flex-direction: column; justify-content: flex-end; align-items: center; display: flex">
      <div className="Frame457886" style="height: 112px; padding-top: 32px; padding-bottom: 32px; background: #E5F3F4; border-top: 2px #AFD8D8 solid; flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: flex">
        <div className="FgsGlobalIncAllRightsReserved" style="color: #2D5453; font-size: 18px; font-family: FK Grotesk; font-weight: 400; line-height: 22px; word-wrap: break-word">2023 — FGS Global Inc ® All Rights Reserved</div>
        <div className="PrivacyImprint" style="color: #2D5453; font-size: 12px; font-family: FK Grotesk; font-weight: 300; line-height: 18px; word-wrap: break-word">Privacy. Imprint</div>
      </div>
    </div>
  </div>
  <div className="Wip" style="width: 182px; height: 113px; padding: 16px; left: 87px; top: 425.16px; position: absolute; transform: rotate(-19.30deg); transform-origin: 0 0; opacity: 0; background: rgba(255, 255, 255, 0.16); box-shadow: 1px 2px 2px #930000; border-radius: 8px; border: 1px #39383D solid; backdrop-filter: blur(3px); justify-content: center; align-items: center; gap: 8px; display: inline-flex">
    <div className="WorkInProgress" style="text-align: center"><span style="color: #CF5F56; font-size: 22px; font-family: FK Grotesk; font-weight: 300; line-height: 24px; word-wrap: break-word">WORK IN <br /></span><span style="color: #CF5F56; font-size: 22px; font-family: FK Grotesk; font-weight: 700; line-height: 24px; word-wrap: break-word">PROGRESS</span></div>
  </div>
</div> */}
  </div>;
};

