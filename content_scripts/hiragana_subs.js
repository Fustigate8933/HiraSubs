const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.addedNodes) {
      for (const node of mutation.addedNodes) {
        if (node.nodeName === 'SPAN' && node.classList.contains('ytp-caption-segment')) {
          const captionText = node.innerText;

          const fetchData = async () => {
            try {

              const response = await fetch('https://labs.goo.ne.jp/api/hiragana', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  app_id: '2f2a63e6fc1af8ebcae02ac0b4c0234edfa7e17ff8250c08370bed9f4b7721f5',
                  sentence: captionText,
                  output_type: 'hiragana'
                })
              });
              const data = await response.json();
              console.log(data.converted);

              const captionContainer = document.createElement('div');
              captionContainer.id = 'captionContainer';
              captionContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              captionContainer.style.color = 'white';
              captionContainer.style.padding = '5px';
              captionContainer.style.zIndex = '9999';
              captionContainer.style.fontSize = '15px';
              node.parentNode.insertBefore(captionContainer, node);
              captionContainer.innerText = data.converted;
            } catch (error) {
              console.error(error);
              const captionContainer = document.createElement('div');
              captionContainer.id = 'captionContainer';
              captionContainer.style.position = 'absolute';
              captionContainer.style.top = '0'; // Align to the top of the parent container
              captionContainer.style.left = '50%'; // Center horizontally
              captionContainer.style.transform = 'translateX(-50%)'; // Center horizontally
              captionContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              captionContainer.style.color = 'white';
              captionContainer.style.padding = '5px';
              captionContainer.style.zIndex = '9999';
              captionContainer.style.fontSize = '15px';
              node.parentNode.insertBefore(captionContainer, node);
              captionContainer.innerText = "An error has occurred";

              node.style.marginBottom = '40px'; // Adjust this value according to the height of the new caption containe
            }
          };

          fetchData();
        }
      }
    }
  }
});

const config = { attributes: true, childList: true, subtree: true };

observer.observe(document.body, config);

