import React, { useState } from "react";
import axios from "axios";

function Newdeployment() {
  const [formData, setFormData] = useState({
    pipelineName: '',
    pipelineDescription: '',
    gitRepoUrl: '',
    gitBranch: '',
    jenkinsfilePath: ''
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Request Payload:', formData);

    // Check if all required fields are filled in
    const requiredFields = ['pipelineName', 'gitRepoUrl', 'jenkinsfilePath'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Create the Axios request body
    const requestBody = {
      pipelineName: formData.pipelineName,
      pipelineDescription: formData.pipelineDescription,
      gitRepoUrl: formData.gitRepoUrl,
      gitBranch: formData.gitBranch,
      jenkinsfilePath: formData.jenkinsfilePath
    };
    

    // Send the Axios request
    try {
      const response = await axios.post('http://13.234.23.179:9090/api/jenkins/createPipeline', requestBody);

      if (response.status === 200) {
        alert('Jenkins pipeline job created successfully');
      } else {
        alert('Error creating Jenkins pipeline job');

        // Log the error to the console for debugging
        console.log(response);
      }
    } catch (error) {
      alert("Error occured");
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Create Jenkins Pipeline Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pipelineName">Pipeline Name:</label>
          <input
            type="text"
            id="pipelineName"
            name="pipelineName"
            value={formData.pipelineName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="pipelineDescription">Pipeline Description:</label>
          <input
            type="text"
            id="pipelineDescription"
            name="pipelineDescription"
            value={formData.pipelineDescription}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="gitRepoUrl">Git Repo URL:</label>
          <input
            type="text"
            id="gitRepoUrl"
            name="gitRepoUrl"
            value={formData.gitRepoUrl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="gitBranch">Git Branch:</label>
          <input
            type="text"
            id="gitBranch"
            name="gitBranch"
            value={formData.gitBranch}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="jenkinsfilePath">Jenkinsfile Path:</label>
          <input
            type="text"
            id="jenkinsfilePath"
            name="jenkinsfilePath"
            value={formData.jenkinsfilePath}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Create Job</button>
        </div>
      </form>
    </div>
  );
}

export default Newdeployment;
