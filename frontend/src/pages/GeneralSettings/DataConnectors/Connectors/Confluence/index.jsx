import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobileHeader } from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { DATA_CONNECTORS } from "@/components/DataConnectorOption";
import System from "@/models/system";
import { Info } from "@phosphor-icons/react/dist/ssr";
import showToast from "@/utils/toast";
import pluralize from "pluralize";
import { TagsInput } from "react-tag-input-component";

export default function ConfluenceConnectorSetup() {
  const { image } = DATA_CONNECTORS.Confluence;
  const [loading, setLoading] = useState(false);
  const [baseUrl, setbaseUrl] = useState(null);
  const [spaceKey, setSpaceKey] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const [settings, setSettings] = useState({
    baseUrl: null,
    spaceKey: null,
    accessToken: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      setLoading(true);
      showToast(
        "Fetching all pages in Space - this may take a while.",
        "info",
        { clear: true, autoClose: false }
      );
      const { data, error } = await System.dataConnectors.Confluence.collect({
        baseUrl: form.get("baseUrl"),
        spaceKey: form.get("spaceKey"),
        accessToken: form.get("accessToken"),
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `${data.files} ${pluralize("file", data.files)} collected from ${
          data.author
        }/${data.baseUrl}:${data.spaceKey}. Output folder is ${data.destination}.`,
        "success",
        { clear: true }
      );
      e.target.reset();
      setLoading(false);
      return;
    } catch (e) {
      console.error(e);
      showToast(e.message, "error", { clear: true });
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
      >
        {isMobile && <SidebarMobileHeader />}
        <div className="flex w-full">
          <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
            <div className="flex w-full gap-x-4 items-center  pb-6 border-white border-b-2 border-opacity-10">
              <img src={image} alt="Confluence" className="rounded-lg h-16 w-16" />
              <div className="w-full flex flex-col gap-y-1">
                <div className="items-center flex gap-x-4">
                  <p className="text-2xl font-semibold text-white">
                    Import Confluence Space
                  </p>
                </div>
                <p className="text-sm font-base text-white text-opacity-60">
                  Import all pages from a public or private Confluence Space
                  and have its information available in your workspace.
                </p>
              </div>
            </div>

            <form className="w-full" onSubmit={handleSubmit}>
              {!accessToken && (
                <div className="flex flex-col gap-y-1 py-4 ">
                  <div className="flex flex-col w-fit gap-y-2 bg-blue-600/20 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-x-2">
                      <Info size={20} className="shrink-0 text-blue-400" />
                      <p className="text-blue-400 text-sm">
                        Accessing a Confluence with a{" "}
                        <a
                          href="https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html"
                          rel="noreferrer"
                          target="_blank"
                          className="underline"
                        >
                          Personal Access Token
                        </a>{" "}
                         is a secure way to use scripts and integrate external applications.
                      </p>
                    </div>
                    <a
                      href="https://confluence.auto.continental.cloud/plugins/personalaccesstokens/usertokens.action"
                      rel="noreferrer"
                      target="_blank"
                      className="text-blue-400 hover:underline"
                    >
                      Create a temporary Access Token for this data connector
                      &rarr;
                    </a>
                  </div>
                </div>
              )}

              <div className="w-full flex flex-col py-2">
                <div className="w-full flex items-center gap-4">
                  <div className="flex flex-col w-60">
                    <div className="flex flex-col gap-y-1 mb-4">
                      <label className="text-white text-sm font-semibold block">
                        Confluence Base URL
                      </label>
                      <p className="text-xs text-zinc-300">
                        Url of the Confluence Base URL wish to collect.
                      </p>
                    </div>
                    <input
                      type="url"
                      name="baseUrl"
                      className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                      placeholder="https://confluence.auto.continental.cloud/"
                      required={true}
                      autoComplete="off"
                      onChange={(e) => setbaseUrl(e.target.value)}
                      onBlur={() => setSettings({ ...settings, baseUrl })}
                      spellCheck={false}
                    />
                  </div>
                  <div className="flex flex-col w-60">
                    <div className="flex flex-col gap-y-1 mb-4">
                      <label className="text-white text-sm block flex gap-x-2 items-center">
                        <p className="font-semibold ">Confluence Space Key</p>{" "}
                      </label>
                      <p className="text-xs text-zinc-300 flex gap-x-2">
                        Confluence Space Key.
                      </p>
                    </div>
                    <input
                      type="text"
                      name="spaceKey"
                      className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                      placeholder="department0443"
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(e) => setSpaceKey(e.target.value)}
                      onBlur={() => setSettings({ ...settings, spaceKey })}
                    />
                  </div>                  
                  <div className="flex flex-col w-60">
                    <div className="flex flex-col gap-y-1 mb-4">
                      <label className="text-white text-sm block flex gap-x-2 items-center">
                        <p className="font-semibold ">Confluence Access Token</p>{" "}
                      </label>
                      <p className="text-xs text-zinc-300 flex gap-x-2">
                        Personal Access Token.
                      </p>
                    </div>
                    <input
                      type="text"
                      name="accessToken"
                      className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                      placeholder="confluence_pat_1234_abcdefg"
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(e) => setAccessToken(e.target.value)}
                      onBlur={() => setSettings({ ...settings, accessToken })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-2 w-fit">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 text-lg w-fit border border-slate-200 px-4 py-1 rounded-lg text-slate-200 items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:bg-slate-200 disabled:text-slate-800"
                >
                  {loading
                    ? "Collecting files..."
                    : "Collect all pages from Confluence Space"}
                </button>
                {loading && (
                  <p className="text-xs text-zinc-300">
                    Once complete, all pages will be available for embedding
                    into workspaces in the document picker.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


