import React from 'react'
import { Github, Mail, Linkedin } from 'lucide-react'
import { FaHashtag } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import moment from "moment";

const LandingPage = () => {
    const today = moment().format("D MMM, YYYY");
  return (
    <div>
        <Navbar />
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-zinc-900">
                Simple. Fast. <br />
                <span className="text-blue-600">Just Notes</span>
              </h1>
              <p className="text-sm md:text-base text-zinc-700 mb-8 max-w-lg mx-auto md:mx-0">
                Focus on what matters most with our beautifully simple note-taking app. Capture thoughts, ideas, and plans with clarity.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  to={"/login"}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md"
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Note Preview */}
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="rounded-2xl shadow-lg bg-white border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 flex items-center space-x-2 bg-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-6">
                  <div className="text-lg font-semibold text-zinc-800 mb-4">Meeting Notes - {today}</div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="text-lg font-semibold text-zinc-800 mb-3">Tags</div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaHashtag className="h-5 w-5 text-green-500 mr-2" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <FaHashtag className="h-5 w-5 text-green-500 mr-2" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <FaHashtag className="h-5 w-5 text-green-500 mr-2" />
                      <div className="h-4 w-3/5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-800 mb-12">What Users Say</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { quote: `"Just Notes has made organizing my thoughts incredibly easy. It’s fast, clean, and just works!"`, name: "— Maherin S., Writer" },
              { quote: `"Finally, a notes app that doesn’t overwhelm. Love the minimal design and smooth experience."`, name: "— Hari R., Developer" },
              { quote: `"This app has helped me stay productive and focused every single day. Highly recommended!"`, name: "— Aisha M., Student" },
            ].map((t, i) => (
              <div key={i} className="bg-blue-50 p-6 rounded-lg shadow-sm">
                <p className="text-zinc-700 italic">{t.quote}</p>
                <div className="mt-4 text-sm font-semibold text-blue-600">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Repo Section */}
      <section className="py-10 bg-blue-50">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">
            Open Source on GitHub
          </h2>
          <p className="text-gray-600 mb-5 text-sm">
            Dive into the code behind <span className="text-blue-600 font-medium">Just Notes</span>. Star it, fork it, or contribute!
          </p>

          <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 mx-auto">
            <div className="flex items-center justify-center mb-3">
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                alt="GitHub"
                className="w-8 h-8"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Just Notes GitHub Repo
            </h3>
            <p className="text-gray-500 mb-4 text-sm">
              Access the full codebase, explore features, or suggest improvements through issues and PRs.
            </p>
            <a
              href="https://github.com/Abdus-8747/just-notes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition text-sm"
            >
              ⭐ Visit Repository
            </a>

            {/* Smaller Social Links */}
            <div className="mt-6 flex justify-center gap-5">
              <a
                href="https://github.com/Abdus-8747"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition text-xs"
              >
                <Github className="w-5 h-5 mb-1" />
                <span>GitHub</span>
              </a>

              <a
                href="mailto:abdussamadshamsi486@gmail.com"
                aria-label="Send Email"
                className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition text-xs"
              >
                <Mail className="w-5 h-5 mb-1" />
                <span>Email</span>
              </a>

              <a
                href="https://www.linkedin.com/in/abdus-samad-shamsi-a61161286/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition text-xs"
              >
                <Linkedin className="w-5 h-5 mb-1" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        &copy; 2025 Just Notes. Built with 💙 by <Link to={"https://www.linkedin.com/in/abdus-samad-shamsi-a61161286/"} className='text-blue-500'>Abdus Samad</Link>.
      </footer>
    </div>
  )
}

export default LandingPage
