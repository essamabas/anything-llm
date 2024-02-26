from flask import Flask
from flask import request

import os

from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits.jira.toolkit import JiraToolkit
from langchain_community.utilities.jira import JiraAPIWrapper
from langchain_openai import OpenAI

from atlassian import Jira


app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

def executeRequest(req):
    token = os.environ['JIRA_API_TOKEN']
    name = os.environ['JIRA_USERNAME']
    url = os.environ['JIRA_INSTANCE_URL']
    llm = OpenAI(temperature=0)
    jira = JiraAPIWrapper(jira_api_token=token, jira_instance_url=url, jira_username=name)
    toolkit = JiraToolkit.from_jira_api_wrapper(jira)
    agent = initialize_agent(
        toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
    )
    res = agent.invoke(req)
    print(res)
    return res
	

@app.route('/api/v1/request', methods = ['POST'])
def requestHandler():
    print('yeah')
    content_type = request.headers.get('Content-Type')
    print(request.headers)
    if (content_type == 'application/json'):
        print('yeeees')
        if(request.json['agentRequest']):
            receivedAgentRequest =  request.json['agentRequest']
            print(f"request received: {receivedAgentRequest}");
            return executeRequest(receivedAgentRequest)

    print("oh no")
    return "request denied"


if __name__ == '__main__':
    os.environ["OPENAI_API_KEY"] = os.environ['OPEN_AI_KEY']
    app.run(host='0.0.0.0', port=3002, debug=True)
