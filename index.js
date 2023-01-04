// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='tags-input-box'>

  <div class='top'>
    ${feather.icons.tag.toSvg()}
    <h3 class='title'>Tags Input Box</h3>
  </div>

  <div class='content'>
    <p>Press enter or add a comma after each tag</p>
    <div class='tags input' data-tags=''>
      <input type='text' spellcheck='false' data-input=''>
    </div>
  </div>

  <div class='footer'>
    <p><span data-count=''>10</span> tags are remaining</p>
    <button data-remove=''>Remove All</button>
  </div>
</div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      tags: document.querySelector('[data-tags]'),
      inputTag: document.querySelector('[data-input]'),
      detailCount: document.querySelector('[data-count]'),
      btnRemove: document.querySelector('[data-remove]'),
    };

    this.PROPS = {
      maxTags: 10,
      tags: this.storageGet(),
    };

    this.countTags();
    this.createTag();

    this.DOM.inputTag.addEventListener('keyup', this.addTag);
    this.DOM.btnRemove.addEventListener('click', this.onRemoveAll);
  }

  /**
   * @function addTag - Add tag after click 'Enter'
   * @param target
   * @param key
   */
  addTag = ({ target, key }) => {
    if (key === 'Enter') {
      let tag = target.value.replace(/\s+/g, ' ');
      if (tag.length > 1 && !this.PROPS.tags.includes(tag)) {
        if (this.PROPS.tags.length < 10) {
          tag.split(',').forEach(tag => {
            this.PROPS.tags.push(tag);
            this.storageSet(this.PROPS.tags)
            this.createTag();
          });
        }
      }
      target.value = '';
    }
  };

  /**
   * @function createTag - Create tag
   */
  createTag = () => {
    this.DOM.tags.querySelectorAll('[data-tag]').forEach(i => i.remove());

    this.PROPS.tags.slice().forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.classList.add('tag');
      tagElement.setAttribute('data-tag', '');
      tagElement.innerHTML = `
          <span>${tag}</span>
          <div data-remove=''>${feather.icons.x.toSvg()}</div>
      `;

      this.DOM.tags.insertBefore(tagElement, this.DOM.inputTag);
      tagElement.querySelector('[data-remove]').addEventListener('click', this.onRemoveTag);
    });

    this.countTags();
  };

  /**
   * @function countTags - Count tags
   */
  countTags = () => {
    this.DOM.inputTag.focus();
    this.DOM.detailCount.innerText = this.PROPS.maxTags - this.PROPS.tags.length;
  };

  /**
   * @function onRemoveAll - Remove all tags
   */
  onRemoveAll = () => {
    if (confirm('Are you sure you want to delete all the tags?')) {
      this.PROPS.tags.length = 0;
      this.DOM.tags.querySelectorAll('[data-tag]').forEach(tag => tag.remove());
      this.countTags();
      localStorage.clear()
      showNotification('success', 'All tags are successfully deleted');
    }
  };

  /**
   * @function onRemoveTag - Remove tag
   * @param target
   */
  onRemoveTag = ({ target }) => {
    const tag = target.closest('.tag').querySelector('span').textContent;
    let index = this.PROPS.tags.indexOf(tag);
    this.PROPS.tags = [...this.PROPS.tags.slice(0, index), ...this.PROPS.tags.slice(index + 1)];
    target.closest('.tag').remove();
    this.countTags();
  };

  /**
   * @function storageGet - Get data from local storage
   * @returns {any|string[]}
   */
  storageGet = () => {
    return localStorage.getItem('tags') ? JSON.parse(localStorage.getItem('tags')) : ['dev', 'react'];
  };

  /**
   * @function storageSet - Set data to local storage
   * @param tags
   */
  storageSet = (tags) => {
    return localStorage.setItem('tags', JSON.stringify(tags));
  };
}

// ⚡️Class instance
new App();
