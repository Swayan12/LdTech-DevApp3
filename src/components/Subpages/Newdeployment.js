import React, { useState } from 'react';
import axios from 'axios';
import './Newdeployment.css';

const Newdeployment = () => {
  const [formData, setFormData] = useState({
    pipelineName: '',
    pipelineDescription: '',
    gitRepoUrl: '',
    gitBranch: '',
    jenkinsfilePath: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3004/api/jenkins/createPipeline', formData);

      if (response.status === 200) {
        alert('Jenkins pipeline job created successfully');
      } else {
        alert('Error creating Jenkins pipeline job');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTriggerBuild = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3004/api/jenkins/triggerBuild', {
        pipelineName: formData.pipelineName,
      });

      if (response.status === 200) {
        alert('Jenkins pipeline job build triggered successfully');
      } else {
        alert('Error triggering Jenkins pipeline job build');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className='Container'>
      <div className='jenkinsformContainer'>
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
            required
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
            required
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
            required
          />
        </div>
        <div>
          <button type="submit">Create Job</button>
        </div>
      </form>
      </div>
     <div  className='jenkinslastContainer'>
     <h2>Trigger Jenkins Pipeline Build</h2>
      <form onSubmit={handleTriggerBuild}>
        <div>
          <label htmlFor="pipelineNameBuild">Pipeline Name:</label>
          <input
            type="text"
            id="pipelineNameBuild"
            name="pipelineName"
            value={formData.pipelineName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Trigger Build</button>
        </div>
      </form>
     </div>
      
    </div>
  );
};

export default Newdeployment;
