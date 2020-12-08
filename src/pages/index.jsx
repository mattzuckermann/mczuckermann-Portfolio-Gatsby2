import "./index.css"
import React, { useState, useRef, useEffect, createContext } from "react"
import { throttle } from "lodash"
import PropTypes from "prop-types"
import SEO from "../components/SEO"
import Header from "../components/Header"
import Home from "../components/Home"
import Projects from "../components/Projects"
import About from "../components/About"
import Footer from "../components/Footer"
export const GlobalContext = createContext()

const Index = () => {
  const homeSection = useRef(null)
  const projectSection = useRef(null)
  const aboutSection = useRef(null)
  const contactSection = useRef(null)
  const allRefs = [homeSection, projectSection, aboutSection, contactSection]
  const [value, setValue] = useState(0)

  const [refIndex, _setRefIndex] = useState(0)
  const refIndexRef = useRef(refIndex)
  const setRefIndex = (data) => {
    refIndexRef.current = data
    _setRefIndex(data)
  }

  const [startY, _setStartY] = useState(0)
  const startYRef = useRef(startY)
  const setStartY = (data) => {
    startYRef.current = data
    _setStartY(data)
  }

  const scrollToSection = (section) => {
    window.scrollTo({
      left: 0,
      top: section.current.offsetTop - 48,
      behavior: "smooth",
    })
  }

  const keyDownListenerFunction = throttle(
    (e) => {
      if (refIndexRef.current !== 0 && e.key === "ArrowUp") {
        setRefIndex(refIndexRef.current - 1)
      } else if (
        refIndexRef.current !== allRefs.length - 1 &&
        e.key === "ArrowDown"
      ) {
        setRefIndex(refIndexRef.current + 1)
      }
    },
    500,
    { trailing: false }
  )

  const mouseListenerFunction = throttle(
    (e) => {
      if (e.wheelDelta > 0 && refIndexRef.current !== 0) {
        setRefIndex(refIndexRef.current - 1)
      } else if (
        e.wheelDelta < 0 &&
        refIndexRef.current !== allRefs.length - 1
      ) {
        setRefIndex(refIndexRef.current + 1)
      }
    },
    1500,
    { trailing: false }
  )

  const touchStartListenerFunction = throttle(
    (e) => {
      setStartY(e.touches[0].clientY)
    },
    500,
    { trailing: false }
  )

  const touchEndListenerFunction = throttle(
    (e) => {
      const endY = e.changedTouches[0].clientY
      if (endY > startYRef.current && refIndexRef.current !== 0) {
        setRefIndex(refIndexRef.current - 1)
      } else if (
        endY < startYRef.current &&
        refIndexRef.current !== allRefs.length - 1
      ) {
        setRefIndex(refIndexRef.current + 1)
      }
    },
    500,
    { trailing: false }
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    window.addEventListener("keydown", keyDownListenerFunction)
    window.addEventListener("mousewheel", mouseListenerFunction)
    window.addEventListener("touchstart", touchStartListenerFunction)
    window.addEventListener("touchend", touchEndListenerFunction)
    return () => {
      window.removeEventListener("keydown", keyDownListenerFunction)
      window.removeEventListener("mousewheel", mouseListenerFunction)
      window.removeEventListener("touchstart", touchStartListenerFunction)
      window.removeEventListener("touchend", touchEndListenerFunction)
    }
  }, [])

  useEffect(() => scrollToSection(allRefs[refIndex]), [refIndex])

  return (
    <GlobalContext.Provider
      value={{
        allRefs,
        value,
        setValue,
        scrollToSection,
        refIndex,
        setRefIndex,
      }}
    >
      <SEO
        title="Zuckermann | Portfolio"
        description="Showcase of accomplishments and projects by Matt Zuckermann"
        image=""
        keywords={[
          `Matt Zuckermann`,
          `Programming`,
          `Web Developer`,
          `Software Engineer`,
          `Full Stack`,
          `Front End`,
          `Back End`,
        ]}
      />
      <Header />
      <div className="parent">
        <section ref={homeSection}>
          <Home />
        </section>
        <section ref={projectSection}>
          <Projects />
        </section>
        <section ref={aboutSection}>
          <About />
        </section>
        <section ref={contactSection}>
          <Footer />
        </section>
      </div>
    </GlobalContext.Provider>
  )
}

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: `Zuckermann | Portfolio`,
}

export default Index
