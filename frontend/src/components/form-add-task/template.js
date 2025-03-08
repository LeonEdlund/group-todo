const template = document.createElement("template");
export default template;

template.innerHTML = `
<custom-header title="Add Task"></custom-header>

<form>
  <input type="text" name="title" placeholder="Title...">
  <textarea type="text" name="description" rows="8" placeholder="Description..."></textarea>

  <select name="assigned-too" id="assign-too">
    <option value="1">Leon Edlund</option>
  </select>

  <select name="difficulty" id="difficulty">
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value="hard">Hard</option>
  </select>

  <button type="submit" id="submit">ADD</button>
</form>
</div>`;
