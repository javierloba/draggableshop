function addEvent(element, event, delegate ) {
    if (typeof (window.event) != 'undefined' && element.attachEvent)
        element.attachEvent('on' + event, delegate);
    else 
        element.addEventListener(event, delegate, false);
}

addEvent(document, 'readystatechange', function() {
    if ( document.readyState !== "complete" ) 
        return true;
        
    let items = document.querySelectorAll("section.products ul li");
    let cart = document.querySelectorAll("#cart ul")[0];
    
    function updateCart(){
        let total = 0.0;
        let cart_items = document.querySelectorAll("#cart ul li")
        for (let i = 0; i < cart_items.length; i++) {
            let cart_item = cart_items[i];
            let quantity = cart_item.getAttribute('data-quantity');
            let price = cart_item.getAttribute('data-price');
            
            let sub_total = parseFloat(quantity * parseFloat(price));
            cart_item.querySelectorAll("span.sub-total")[0].innerHTML = " = " + sub_total.toFixed(2);
            
            total += sub_total;
        }
        
        document.querySelectorAll("#cart span.total")[0].innerHTML = total.toFixed(2);
    }
    
    function addCartItem(item, id) {
        let clone = item.cloneNode(true);
        clone.setAttribute('data-id', id);
        clone.setAttribute('data-quantity', 1);
        clone.removeAttribute('id');
        
        let fragment = document.createElement('span');
        fragment.setAttribute('class', 'quantity');
        fragment.innerHTML = ' x 1';
        clone.appendChild(fragment);	
        
        fragment = document.createElement('span');
        fragment.setAttribute('class', 'sub-total');
        clone.appendChild(fragment);					
        cart.appendChild(clone);
    }
    
    function updateCartItem(item){
        let quantity = item.getAttribute('data-quantity');
        quantity = parseInt(quantity) + 1
        item.setAttribute('data-quantity', quantity);
        let span = item.querySelectorAll('span.quantity');
        span[0].innerHTML = ' x ' + quantity;
    }
    
    function onDrop(event){			
        if(event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        
        let id = event.dataTransfer.getData("Text");
        let item = document.getElementById(id);			
                    
        let exists = document.querySelectorAll("#cart ul li[data-id='" + id + "']");
        
        if(exists.length > 0){
            updateCartItem(exists[0]);
        } else {
            addCartItem(item, id);
        }
        
        updateCart();
        
        return false;
    }
    
    function onDragOver(event){
        if(event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        return false;
    }

    addEvent(cart, 'drop', onDrop);
    addEvent(cart, 'dragover', onDragOver);
    
    function onDrag(event){
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        let target = event.target || event.srcElement;
        let success = event.dataTransfer.setData('Text', target.id);
    }
        
    
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item.setAttribute("draggable", "true");
        addEvent(item, 'dragstart', onDrag);
    };
});