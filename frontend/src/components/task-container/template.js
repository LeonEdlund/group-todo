const template = document.createElement("template");
export default template;

template.innerHTML = `
      <div class="task-wrapper">
        <div class="visible-content">
          <div id="left-content">
            <div class="content">
              <label class="checkBox">
                <input type="checkbox" id="ch1">
                <div class="transition"></div>
              </label>
            </div>
            
            <div>
              <p id="task-title"></p>
              <i id="assigned"></i>
            </div>
          </div>
          
          <ion-icon name="chevron-down-outline" size="large" id="arrow-btn"></ion-icon>
        </div >

        <div id="description-wrapper">
          <p>Description</p>
          <i id="description"></i>
        
          <p>Difficulty</p>
          <i id="difficulty"></i>
        </div>
          
      </div>`;
