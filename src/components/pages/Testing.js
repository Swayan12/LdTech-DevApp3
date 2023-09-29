import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faSearch, faBug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../App.css';

const Testing = () => {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('ascending'); // Default sort order
  const [bugsData, setBugsData] = useState([]); // State to store bug data
  const [alertStatusData, setAlertStatusData] = useState({});
  const [totalIssues, setTotalIssues] = useState(0); // Total number of issues
  const [activeTab, setActiveTab] = useState('projects'); // To track active tab (projects or issues)

  const backendUrl = 'http://13.234.23.179:3004/api/projects';
  const backendUrlIssues = 'http://13.234.23.179:3004/api/issues';

  const fetchProjects = async () => {
    try {
      // Fetch project data
      const projectsResponse = await axios.get(backendUrl);
      setProjects(projectsResponse.data);

      // Fetch bug data
      const bugsResponse = await axios.get('http://13.234.23.179:3004/api/bugs');
      setBugsData(bugsResponse.data.projects);

      // Fetch alert_status for each project
      const alertStatusData = {};
      for (const project of projectsResponse.data) {
        const alertStatusResponse = await axios.get(`http://13.234.23.179:3004/api/alert-status/${project.key}`);
        alertStatusData[project.key] = alertStatusResponse.data.alert_status;
      }
      setAlertStatusData(alertStatusData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await axios.get(backendUrlIssues);
      setIssues(response.data);
      // Calculate the total number of issues
      const total = response.data.length;
      setTotalIssues(total);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  // Function to filter and sort projects based on the search query and sort order
  const filteredProjects = projects
    .filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'ascending') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  // Calculate the number of projects and format lastAnalysisDates
  useEffect(() => {
    // Load projects and issues when the component mounts
    fetchProjects();
    fetchIssues();

    return () => {
      // Cleanup: Cancel any ongoing axios requests when the component unmounts
      axios.CancelToken.source().cancel('Request canceled');
    };
  }, []);

  const formatLastAnalysis = (lastAnalysisDate) => {
    const now = new Date();
    const analysisDate = new Date(lastAnalysisDate);
    const timeDifference = Math.floor((now - analysisDate) / (1000 * 60)); // Calculate time difference in minutes

    if (timeDifference < 1) {
      return 'Last analysis: less than a minute ago';
    } else if (timeDifference < 60) {
      return `Last analysis: ${timeDifference} minutes ago`;
    } else if (timeDifference < 1440) {
      const hours = Math.floor(timeDifference / 60);
      return `Last analysis: ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(timeDifference / 1440);
      return `Last analysis: ${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  const createProjectDivs = () => {
    return filteredProjects.map((project, index) => (
      <div key={project.key} className="project-div">
        <div className="project-info">
          <div className="project-name">
            {project.name}
            {alertStatusData[project.key] && (
              <span className={`alert-status ${alertStatusData[project.key].toLowerCase()}`}>
                {alertStatusData[project.key]}
              </span>
            )}
          </div>
          <div className="bugs">
            <FontAwesomeIcon
              icon={faBug}
              className="bug-icon"
              style={{ color: 'black', marginRight: '5px' }}
            />
            Bugs: {getBugCountForProject(project.key)}
          </div>
        </div>
        {project.lastAnalysisDate && (
          <div className="last-analysis">
            {formatLastAnalysis(project.lastAnalysisDate)}
          </div>
        )}
      </div>
    ));
  };

  // Function to get the bug count for a specific project
  const getBugCountForProject = (projectKey) => {
    const bugInfo = bugsData.find((bug) => bug.projectKey === projectKey);
    return bugInfo ? bugInfo.bugs : 0;
  };

  const formatDateAgo = (dateString) => {
    const currentDate = new Date();
    const previousDate = new Date(dateString);
    const timeDifference = currentDate - previousDate;
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;

    if (timeDifference < minute) {
      return 'Less than a minute ago';
    } else if (timeDifference < hour) {
      const minutesAgo = Math.floor(timeDifference / minute);
      return `${minutesAgo} min ago`;
    } else if (timeDifference < day) {
      const hoursAgo = Math.floor(timeDifference / hour);
      return `${hoursAgo} hour ago`;
    } else {
      const daysAgo = Math.floor(timeDifference / day);
      return `${daysAgo} days ago`;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="main-container">
      <div className="nav">
        <div className={`nav-items ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => handleTabClick('projects')}>
          Projects
        </div>
        <div className={`nav-items ${activeTab === 'issues' ? 'active' : ''}`} onClick={() => handleTabClick('issues')}>
          Issues
        </div>
      </div>
       
      {activeTab === 'projects' && (
       <>
      <div className="search-container">
        <p>Project Search</p>
        <input
          type="text"
          placeholder="Search project name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>

      <div className="prosort">
        <p>Projects: <span>{filteredProjects.length}</span></p>
        <p>SortBy:</p>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>

      <div className="project-container">
        {createProjectDivs()}
      </div>
      </>
     )}
      {activeTab === 'issues' && (
        <>
        <div className="total-issues">
           Total Issues: {totalIssues}
         </div>

      <div className="issues-container">
        {issues.map((issue, index) => (
          <div key={index} className="issue-item">
            <div className="issue-box">
              <div className="issue-content">
                <strong>Author:</strong> {issue.author}
                <br />
                <strong style={{ color: 'rgb(75, 86, 187)' }}>{issue.message}</strong> 
              </div>
              <div className="issue-details">
                {issue.effort && (
                  <p>{issue.effort} effort</p>
                )}
                {issue.date && (
                  <p>{formatDateAgo(issue.date)}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
};

export default Testing;
