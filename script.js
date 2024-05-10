const terminalContent = document.getElementById("terminalContent");
const inputBox = document.getElementById("commandInput");

function applyTheme(theme) {
  const root = document.documentElement;

  switch (theme) {
    case "ubuntu":
      root.style.setProperty("--dark-bg", "#2c001e"); // Dark purple background (Ubuntu-like)
      root.style.setProperty("--green-text", "#dd4814"); // Ubuntu orange
      root.style.setProperty("--green-border", "#dd4814"); // Ubuntu orange
      root.style.setProperty("--scrollbar-thumb", "#dd4814"); // Ubuntu orange for scrollbar
      root.style.setProperty("--scrollbar-track", "#3d3d3d"); // Darker gray for scrollbar track
      break;
    case "linuxmint":
      root.style.setProperty("--dark-bg", "#2e2e2e"); // Dark gray background (Linux Mint-like)
      root.style.setProperty("--green-text", "#4caf50"); // Linux Mint green
      root.style.setProperty("--green-border", "#4caf50"); // Linux Mint green
      root.style.setProperty("--scrollbar-thumb", "#4caf50"); // Linux Mint green for scrollbar
      root.style.setProperty("--scrollbar-track", "#424242"); // Darker gray for scrollbar track
      break;
    case "fedora":
      root.style.setProperty("--dark-bg", "#292929"); // Fedora-like dark gray background
      root.style.setProperty("--green-text", "#1f98d0"); // Fedora blue
      root.style.setProperty("--green-border", "#1f98d0"); // Fedora blue
      root.style.setProperty("--scrollbar-thumb", "#1f98d0"); // Fedora blue for scrollbar
      root.style.setProperty("--scrollbar-track", "#333333"); // Darker gray for scrollbar track
      break;
    case "debian":
      root.style.setProperty("--dark-bg", "#1b1b1b"); // Debian-like dark gray background
      root.style.setProperty("--green-text", "#d70a53"); // Debian red
      root.style.setProperty("--green-border", "#d70a53"); // Debian red
      root.style.setProperty("--scrollbar-thumb", "#d70a53"); // Debian red for scrollbar
      root.style.setProperty("--scrollbar-track", "#4d4d4d"); // Darker gray for scrollbar track
      break;
    default:
      break;
  }

  // Store selected theme in localStorage
  localStorage.setItem("selectedTheme", theme);
  //if no local storage set theme to debian
}

// Function to load the theme from localStorage (if available)
function loadTheme() {
  const savedTheme = localStorage.getItem("selectedTheme");
  //if no local storage set theme to debian
  if (!savedTheme) {
    applyTheme("debian");
  }

  if (savedTheme) {
    applyTheme(savedTheme);
  }
}

// Initialize theme on page load
loadTheme();

function handleCommand(command) {
  let response = "";

  const parts = command.trim().split(" ");
  const baseCommand = parts[0].toLowerCase();
  const theme = parts.slice(1).join(" ").toLowerCase();

  switch (baseCommand) {
    case "ls":
      response =
        "<h2>Available Commands:</h2>" +
        "<ul>" +
        "<li>ls - List available commands</li>" +
        "<li>skills - View my skills</li>" +
        "<li>projects - See my projects</li>" +
        "<li>about - Information about me</li>" +
        "<li>contact - Contact information</li>" +
        "<li>theme [debian/mint/ubuntu/fedora] - Switch theme</li>" +
        "</ul>";
      break;
    case "skills":
      // Fetch skills from data.json
      fetchJsonData("data.json", "skills")
        .then((skills) => {
          response = "<h2 >Skills:</h2><p>" + skills.join(", ") + "</p>";
          appendResponse(response);
        })
        .catch(() => {
          response = "<p>Error fetching skills data.</p>";
          appendResponse(response);
        });
      break;
    case "projects":
      // Fetch projects from data.json
      fetchJsonData("data.json", "projects")
        .then((projects) => {
          response = "<h2>Projects:</h2><ul>";
          projects.forEach((project) => {
            response +=
              "<li><strong>" +
              project.name +
              "</strong><br>" +
              project.description +
              "</li>";
          });
          response += "</ul>";
          appendResponse(response);
        })
        .catch(() => {
          response = "<p>Error fetching projects data.</p>";
          appendResponse(response);
        });
      break;
    case "about":
      // Fetch about me information from data.json
      fetchJsonData("data.json", "aboutMe")
        .then((aboutMe) => {
          response = "<h2>About Me:</h2><p style='text-align:justify'>" + aboutMe + "</p>";
          appendResponse(response);
        })
        .catch(() => {
          response = "<p>Error fetching about me information.</p>";
          appendResponse(response);
        });
      break;
    case "contact":
      // Function to fetch data from JSON file
      const fetchDataFromJson = async () => {
        try {
          const response = await fetch("data.json"); // Assuming data.json is in the same directory
          const data = await response.json();

          // Extract contact details from the fetched JSON data
          const { contactEmail, github, linkedin, resume, facebook } = data;

          // Generate HTML to display the fetched contact information
          const responseHtml = `
              <h2>Contact Me:</h2>
              <p>You can contact me at <a href="mailto:${contactEmail}">${contactEmail}</a> </p>
              <p class="u"><a href="${github}" target="_blank">GitHub </a> / <a href="${linkedin}" target="_blank">LinkedIn</a> / <a href="${resume}" target="_blank">Resume</a> / <a href="${facebook}" target="_blank">Facebook </a></p>
            `;

          // Append the generated HTML to the DOM
          appendResponse(responseHtml);
        } catch (error) {
          const errorMessage = "Error fetching contact information.";
          appendResponse(`<p>${errorMessage}</p>`);
        }
      };

      // Call the fetchDataFromJson function to fetch and display contact details
      fetchDataFromJson();
      break;

    case "theme":
      switch (theme) {
        case "debian":
          applyTheme("debian");
          response = "<p>Switched to Debian theme.</p>";
          break;
        case "mint":
          applyTheme("linuxmint");
          response = "<p>Switched to Linux Mint theme.</p>";
          break;
        case "ubuntu":
          applyTheme("ubuntu");
          response = "<p>Switched to Ubuntu theme.</p>";
          break;
        case "fedora":
          applyTheme("fedora");
          response = "<p>Switched to Fedora theme.</p>";
          break;
        default:
          response =
            '<p>Invalid theme specified. Use "debian", "mint","fedora", or "ubuntu".</p>';
          break;
      }
      break;
    default:
      response = `<p>Command not found: ${command}</p>`;
      break;
  }
  if (response) {
    appendResponse(response);
  }
}

// Helper function to fetch data from JSON file
function fetchJsonData(jsonFile, key) {
  return fetch(jsonFile)
    .then((response) => response.json())
    .then((data) => data[key]);
}

// Helper function to append response to terminal content
function appendResponse(html) {
  terminalContent.innerHTML += `<span class='command-arrow'></span>${html}`;
  terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent form submission
  const command = inputBox.value.trim().toLowerCase();
  handleCommand(command);
  inputBox.value = ""; // Clear input field after handling command
}

handleCommand("ls"); // List available commands on page load
