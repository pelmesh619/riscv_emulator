function test() {
    console.log('fjdhiowhicw');

function boldFactory(text: string) {
    let n = document.createElement('b');
    n.innerText = text;
    return n;
}
function strikeFactory(text: string) {
    let n = document.createElement('strike');
    n.innerText = text;
    return n;
}
function italicFactory(text: string) {
    let n = document.createElement('i');
    n.innerText = text;
    return n;
}

const instructions: { [tag: string]: (text: string) => HTMLElement } = {
    'addi': boldFactory,
    'add': boldFactory,
    'mul': strikeFactory,
    'lb': italicFactory,
}

class TextAreaManager {
    id: string;
    allowedTags = ['div', 'br'];
    allowedText: { [tag: string]: string[] } = {
        'b': ['addi'],
        'i': [],
        'strike': [],
    };
  
    DOMObject: HTMLElement;
    nodePath: number[] = [];
    offset: number = 0;
    container: Node | null = null;
  
    constructor(id: string) {
      this.id = id;
      const el = document.getElementById(this.id);
      if (!el) {
        throw new Error(`Element with id "${this.id}" not found`);
      }
      this.DOMObject = el;
    }
  
    public update() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            console.warn("No active selection");
            return;
        }
        const range = selection.getRangeAt(0);
    
        const originalContainer = range.startContainer;
        const offset = range.startOffset;

        this.nodePath = this.getNodePath(originalContainer);
        this.offset = offset;
        this.container = originalContainer;

        console.log('============');

        console.log(this.container, this.nodePath, this.offset);
    
        this.traverse(this.DOMObject);

        console.log(this.container, this.nodePath, this.offset);
    
        this.traverse2(this.DOMObject);
    
        let newContainer = this.container;
    
        let newOffset = this.offset;
    
        while (newOffset > newContainer.textContent!.length) {
            newOffset -= newContainer.textContent!.length;
            let exit = 0;
            while (!newContainer.nextSibling) {
                newContainer = newContainer.parentNode as Node;
                if (newContainer == this.DOMObject) {
                    exit = 1;
                    newContainer = this.getNodeFromPath() || this.DOMObject;
                    this.offset = newContainer.textContent!.length;
                    break;
                }
            }
            if (exit == 1) {
                break;
            }
            newContainer = newContainer.nextSibling as Node;
            while (newContainer.firstChild) {
                newContainer = newContainer.firstChild;
            }
        }
        console.log(this.container, this.getNodePath(newContainer), this.offset);

        const newRange = document.createRange();
        try {
            newRange.setStart(newContainer, newOffset);
        } catch (e) {
            console.error("Error while setting range:", e);
            return;
        }
        newRange.collapse(true);
    
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
  
    private getNodePath(target: Node): number[] {
        const path: number[] = [];
        let node: Node | null = target;
        let parent;
        while (node && node !== this.DOMObject) {
            parent = node.parentNode!;
            if (!parent) 
                break;
            const index = Array.prototype.indexOf.call(parent.childNodes, node);
            path.unshift(index);
            node = parent;
        }
        return path;
    }
  
    private getNodeFromPath(): Node | null {
        let node: Node = this.DOMObject;
        for (const index of this.nodePath) {
            if (node.childNodes[index]) {
                node = node.childNodes[index];
            } else {
                return null;
            }
        }
        return node;
    }
  
    private traverse(node: Node, path: number[] = []) {
        var children = Array.from(node.childNodes);
        children.forEach((child, i) => {
            const element = child as Element;
            if (element.nodeType == Node.TEXT_NODE && element.textContent == "") {
                node.removeChild(element);
                return;
            }
            if (child.nodeType !== Node.ELEMENT_NODE) {
                return;
            }

            if (!this.checkTag(element)) {
                console.log(element.tagName, element.innerHTML);
                const parent = element.parentNode;
                if (!parent) {
                    return;
                }

                while (element.firstChild) {
                parent.insertBefore(element.firstChild, element);
                }
                parent.removeChild(element);
            } else {
                this.traverse(child, path.concat(i));
            }
        });
        children = Array.from(node.childNodes);
        let textNode: Element | null = null;

        children.forEach((child, i) => {
            if (child.nodeType == Node.TEXT_NODE) {
                if (textNode == null) {
                    textNode = child as Element;
                } else {
                    if (child === this.container) {
                        this.container = textNode;
                        this.offset += textNode.textContent?.length!;
                    }
                    textNode.textContent += child.textContent!;
                    node.removeChild(child);
                }
            } else {
                textNode = null;
            }
        });
      }
  
    private traverse2(node: Node, path: number[] = []) {
        const children = Array.from(node.childNodes);
        children.forEach((child, i) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                this.traverse2(child, path.concat(i));
                return;
            }
            if (child.nodeType != Node.TEXT_NODE) {
                return;
            }

            this.tryFormat(node, child);
        });
    }

    private tryFormat(parent: Node, node: Node) {
        let text = node.textContent!;
        for (let ins in instructions) {
            if (!text.includes(ins)) {
                continue;
            }
            let b = node === this.container;
            
            let j = text.indexOf(ins);
            node.textContent = text.slice(j + ins.length, text.length);

            let c = document.createTextNode(text.slice(0, j));
            parent.insertBefore(c, node);

            let n = instructions[ins](text.slice(j, j + ins.length));
            parent.insertBefore(n, node);

            if (b) {
                if (this.offset < j) {
                    this.container = c;
                } else if (this.offset >= j && this.offset < j + ins.length) {
                    this.container = n.firstChild;
                    this.offset -= j;
                } else {
                    this.offset -= j + ins.length;
                }
            }
            text = node.textContent!;

            this.tryFormat(parent, c);
            this.tryFormat(parent, node);

            break;
        }

    }
      
    private checkTag(node: Element): boolean {
        const tagName = node.tagName.toLowerCase();
        if (tagName in this.allowedTags) {
            return true;
        }
        if (!this.allowedText.hasOwnProperty(tagName)) {
            return true;
        }

        return false;
    }
  }
  

window.onload = () => {
    test();

    const textarea = new TextAreaManager('textarea');

    const elem = document.getElementById('textarea');

    elem?.addEventListener('input', (e) => {
        
        textarea.update();
    
        const display = document.getElementById('displayArea');
        if (display) {
            display.innerText = textarea.DOMObject.innerHTML + '\n' + textarea.nodePath + ' ' + textarea.offset;
        }
        
    })
}

