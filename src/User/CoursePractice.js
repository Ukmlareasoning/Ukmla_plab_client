// Compatibility re-export:
// - Keeps old module URLs working (e.g. cached `/src/User/CoursePractice.js`)
// - Avoids JSX-in-.js parsing errors by keeping this file JS-only
export { default } from './CoursePractice.jsx'

