import {
  VscFolderLibrary,
  VscGraphLine,
  VscAccount,
  VscGear,
} from "react-icons/vsc";

const SideBar = ({ click }) => {
  return (
    <div
      className="h-screen pt-4
    w-16 m-0 flex flex-col bg-gray-800 text-white shadow"
    >
      <SideBarIcon
        icon={<VscFolderLibrary size="28" />}
        text="File Explorer"
        click={click}
      />
      <SideBarIcon
        icon={<VscGraphLine size="28" />}
        text="Gallery"
        click={click}
      />
      <SideBarIcon
        icon={<VscAccount size="28" />}
        text="Account"
        click={click}
      />
      <SideBarIcon icon={<VscGear size="28" />} text="Settings" click={click} />
    </div>
  );
};

const SideBarIcon = ({ icon, text = "tooltip 💡", click }) => {
  return (
    <div className="sidebar-icon group" onClick={() => click(text)}>
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
};

export default SideBar;
