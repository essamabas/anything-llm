import React, { useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
//import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import System from "@/models/system";

const noop = () => false;
export default function NewAgentRequestModal({ hideAgentModal = noop }) {
  const formEl = useRef(null);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const handleCreate = async (e) => {
  	console.log("received request");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
	/*
      <div
        className="flex fixed top-0 left-0 right-0 w-full h-full"
        onClick={hideAgentModal}
      />
	  */
      <div className="relative w-[500px] max-h-full">
        <div className="relative bg-modal-gradient rounded-lg shadow-md border-2 border-accent">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-white/10">
            <h3 className="text-xl font-semibold text-white">New Jira agent request</h3>
            <button
              onClick={hideAgentModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <form ref={formEl} onSubmit={handleCreate}>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Agent Request Prompt
                  </label>
                  <input
                    name="prompt"
                    type="text"
					onChange={ (e) => setMsg(e.target.value) }
                    id="prompt"
                    className="bg-zinc-900 w-full text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="My Prompt"
                    required={true}
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm">Error: {error}</p>
                )}
              </div>
            </div>


          <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-white/10 rounded-b">
		  <button
		  	onClick = { async (e) => {
					  console.log("send jira request");
					  const { data, error } = await System.Agents.Jira.request({
						request: {msg},
					  });
					}
				}
			type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
			> Send
		  </button>
		  </div>


            <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-white/10 rounded-b">
              <button
                type="submit"
                className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function useNewAgentRequestModal() {
  const [agentShowing, setAgentShowing] = useState(false);
  const showAgentModal = () => {
    setAgentShowing(true);
  };
  const hideAgentModal = () => {
    setAgentShowing(false);
  };

  return { agentShowing, showAgentModal, hideAgentModal };
}
