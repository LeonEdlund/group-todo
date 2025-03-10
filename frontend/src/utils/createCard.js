import parseDate from "./parseDate";

export default function createCard(project) {
  const card = document.createElement("project-card");
  const createdAt = parseDate(project.created_at);
  card.setAttribute("id", project.project_id);
  card.setAttribute("title", project.title);
  card.setAttribute("created", createdAt);
  card.setAttribute("cover_img", project.img);
  card.setAttribute("progress", `${project.progress_percentage}%`);

  const owner = document.createElement("li");
  owner.setAttribute("slot", "member-list-item");
  const wrapper = document.createElement("i");

  wrapper.innerText = project.owner;
  owner.appendChild(wrapper);
  card.appendChild(owner);

  const members = JSON.parse(project.members);
  if (members.length > 0) {
    for (let i = 0; i < members.length; i++) {
      const listItem = document.createElement("li");
      listItem.setAttribute("slot", "member-list-item");
      const wrapper = document.createElement("i");

      if (i < 2) {
        wrapper.innerText = members[i].name;
        listItem.appendChild(wrapper);
        card.appendChild(listItem);
      } else {
        wrapper.innerText = "+2";
        listItem.appendChild(wrapper);
        card.appendChild(listItem);
        break;
      }
    }
  }

  return card;
}