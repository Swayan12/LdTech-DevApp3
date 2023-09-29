import React, { useState, useEffect } from 'react';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub as fabGithub } from '@fortawesome/free-brands-svg-icons';

function Github() {
  const [isAuthorized, setIsAuthorized] = usePersistentState('isAuthorized', false);
  const [authorizationMessage, setAuthorizationMessage] = useState('');
  const [username, setUsername] = usePersistentState('username', '');
  const [repositoryName, setRepositoryName] = usePersistentState('repositoryName', '');
  const [branch, setBranch] = usePersistentState('branch', '');
  const [repositoryData, setRepositoryData] = usePersistentState('repositoryData', []);
  const [repositoryInfo, setRepositoryInfo] = usePersistentState('repositoryInfo', null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastStatus, setLastStatus] = usePersistentState('lastStatus', 'N/A');
  const [lastModified, setLastModified] = usePersistentState('lastModified', 'N/A');
  
  const handleAuthorize = () => {
    // Redirect the user to your server's /authorize route
    window.location.href = 'http://13.234.23.179:3004/authorize'; // Change this URL to your server's URL
  };

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      // Fetch repository data using the GitHub API
      const apiUrl = `https://api.github.com/repos/${username}/${repositoryName}/contents?ref=${branch}`;
      const response = await fetch(apiUrl);

      if (response.status === 200) {
        const data = await response.json();
        setRepositoryData(data);
        setAuthorizationMessage('Repository Data Loaded Successfully');
        // Fetch additional repository information
        await fetchRepositoryInfo(username, repositoryName);
        console.log(data);
      } else {
        setRepositoryData([]);
        setAuthorizationMessage('Error: Repository or Branch not found');
        console.error('Error fetching repository data.');
      }
    } catch (error) {
      console.error('Error fetching repository data:', error);
      setRepositoryData([]);
      setAuthorizationMessage('Error: Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLastActivity = async (owner, repoName) => {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/events`;
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const data = await response.json();
        if (data.length > 0) {
          const lastEvent = data[0]; // Assuming the first event is the last one
          const eventType = lastEvent.type;
          setLastStatus(eventType);
          console.log(data);
        } else {
          setLastStatus('No recent activity');
        }
      } else {
        setLastStatus('N/A');
      }
    } catch (error) {
      console.error('Error fetching last activity:', error);
      setLastStatus('N/A');
    }
  };

  const fetchLastModified = async (owner, repoName) => {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/commits`;
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const data = await response.json();
        if (data.length > 0) {
          const lastCommit = data[0]; // Assuming the first commit is the most recent
          const modifiedDate = new Date(lastCommit.commit.author.date);
          
          // Format the date in IST
          const formattedDate = modifiedDate.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          });
          
          setLastModified(formattedDate);
        } else {
          setLastModified('No commits found');
        }
      } else {
        setLastModified('N/A');
      }
    } catch (error) {
      console.error('Error fetching last modified date:', error);
      setLastModified('N/A');
    }
  };


  const fetchRepositoryInfo = async (owner, repoName) => {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repoName}`;
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const data = await response.json();
        setRepositoryInfo({
          name: data.name,
          url: data.html_url,
          owner: data.owner.login,
        });

        // Fetch the last activity
        await fetchLastActivity(owner, repoName);
         // Fetch the last modified date
      await fetchLastModified(owner, repoName);

      } else {
        setRepositoryInfo(null);
        setLastStatus('N/A');
      }
    } catch (error) {
      console.error('Error fetching repository info:', error);
      setRepositoryInfo(null);
      setLastStatus('N/A');
    }
  };

  useEffect(() => {
    // Check if there's an authorization code in the URL.
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      // If a code exists, we are coming back from GitHub's authorization page.
      setIsAuthorized(true);
      getAccessToken(code);
    }
  }, [setIsAuthorized]);

// Custom hook to manage state and session storage
function usePersistentState(key, initialState) {
  const [state, setState] = useState(() => {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}


  async function getAccessToken(code) {
    try {
      const response = await fetch(`http://13.234.23.179:3004/callback?code=${code}`);
      const data = await response.json(); // Parse the response as JSON
      console.log(data);
      if (data.status === 'success') {
        setAuthorizationMessage('Authorize Success');
      } else {
        setAuthorizationMessage('Authorize Fail: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
      setAuthorizationMessage('Authorize Fail: Network Error');
    }
  }

  const handleClear = () =>{
    setUsername('');
    setRepositoryName('');
    setBranch('');
  }

 
  return (
    <div className='github-page'>
      <div className='git-head'>
         <p>Authorize your GitHub Account > Click on Authorize Button </p>
         <button onClick={handleAuthorize}>Authorize</button>
         {isAuthorized && <p>{authorizationMessage}</p>}
      </div>

      {isAuthorized && (
        <div className='git-container'>
           <FontAwesomeIcon icon={fabGithub} className='github-icon' />
           <h1 className='github-title'> GitHub &gt; {username ? <span>{username}</span> : 'Owner'} </h1>
          <table className='github-form'>
          <tbody>
          <tr>
            <td><label>Username:</label></td> 
            <td><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></td> 
          </tr>
          <tr>
            <td><label>Repository Name:</label></td>
            <td><input type="text" value={repositoryName} onChange={(e) => setRepositoryName(e.target.value)} /></td> 
          </tr>
          <tr>
            <td><label>Branch:</label></td> 
            <td><input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} /></td> 
          </tr>
          </tbody>
          </table>
          <div className='button-container'>
            <button onClick={handleClear}>Clear</button>
            <button onClick={handleSearch} disabled={isLoading}>Search Repo</button>
          </div>

          {isLoading && <p>Loading...</p>}
          {!isLoading && (
            <div className='repo-details'>
             {repositoryInfo && (
              <div className='repo-info'>
                 <h3>Repository Information</h3>
                 <table className='repo-table'>
                   <thead>
                      <tr>
                       <th>Name</th>
                       <th>URL</th>
                       <th>Owner</th>
                       <th>Last Status</th>
                       <th>Repository Contents</th>
                       <th>Last Modified</th>
                     </tr>
                  </thead>
                <tbody>
                <tr>
                   <td>{repositoryInfo.name}</td>
                   <td><a href={repositoryInfo.url} target="_blank" rel="noopener noreferrer">{repositoryInfo.url}</a></td>
                   <td>{repositoryInfo.owner}</td>
                   <td>{lastStatus}</td>
                   <td>
                      <div className='dropdown-container'>
                          {repositoryData.length > 0 ? (
                          <select>
                            {repositoryData.map((item) => (
                            <option key={item.name}>{item.name}</option>
                            ))}
                         </select>
                        ) : (
                          <p>No repository data to display.</p>
                         )}
                       </div>
                   </td>
                   <td>{lastModified}</td>
               </tr>
            </tbody>
         </table>
      </div>
        )}
   
            </div>
          )}
        </div>
      )}
     
    </div>
  );
}


export default Github;