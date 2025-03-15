import parseDate from "./parseDate";

export default function createCard(project) {
  if (!project) return;

  const card = document.createElement("project-card");
  const createdAt = parseDate(project.created_at);
  card.setAttribute("id", project.project_id);
  card.setAttribute("title", project.title);
  card.setAttribute("created", createdAt);
  card.setAttribute("cover_img", project.img);
  card.setAttribute("progress", `${project.progress_percentage}%`);

  let membersElems = [];
  for (let i = 0; i < 3; i++) {
    if (!project.members[i]) break;
    membersElems.push(createMemberElem(project.members[i].display_name));
  }

  if (project.members.length > 3) {
    const nr = project.members.length - 3;
    membersElems.push(createMemberElem(`+${nr}`));
  }

  card.append(...membersElems);

  return card;
}

function createMemberElem(text) {
  const listItem = document.createElement("li");
  listItem.setAttribute("slot", "member-list-item");
  const wrapper = document.createElement("i");
  wrapper.innerText = text;
  listItem.appendChild(wrapper);
  return listItem;
}