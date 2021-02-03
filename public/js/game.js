const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
const socketUrl = socketProtocol + '//' + window.location.hostname + ':' + window.location.port + '/game'
const ws = new WebSocket(socketUrl);

function generateHeading(title, body, icon) {
  const iconHtml = getIcon(icon);
  const html = `
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">${title} <span class="float-right">${iconHtml}</span></h5>
      <p class="card-text">${body}</p>
    </div>
  </div>`;
  return html;
}

function getIcon(icon) {
  switch(icon) {
    case "loading":
      return `<i class="fas fa-spinner fa-spin"></i>`;
    case "waiting":
      return `<i class="fas fa-hourglass-start fa-spin"></i>`;
    case "question":
      return `<i class="fas fa-question-circle"></i>`;
    case null:
      return ``;
    default:
      return `<i class="fas fa-bug text-danger"></i>`;
  }
}

function renderContent(content) {
  $('.gamebox').html(content);
}

function send(action, data) {
  const payload = {
    "a": action,
    "t": Date.now(),
    "d": data
  };
  ws.send(JSON.stringify(payload));
}

function handlePong() {
  send("pong", null);
}

function handleHeading(title, body, icon) {
  renderContent(generateHeading(title, body, icon));
}

function handleMultipleChoiceQuestion(question, answers) {
  let html = generateHeading("Question", question, "question");
  html += `<div class="row">`
  for (const answer of answers) {
    html += `
    <div class="col-md-6 mb-3">
      <button type="button" class="multiple-choice-button" data-answer-id="${answer.id}">
        ${answer.text}
      </button>
    </div>
    `;
  }
  html += "</div>";
  renderContent(html);
  $('.multiple-choice-button').click(function(event) {
    const answerId = $(this).attr("data-answer-id");
    send("multipleChoiceAnswer", {
      "answerId": answerId
    });
  });
}

ws.onopen = function (event) {
  console.log("Connected!");
  //ws.send("Here's some text that the server is urgently awaiting!");
};

ws.onmessage = function(event) {
  const msg = JSON.parse(event.data);
  const time = new Date(msg.t);
  const timeStr = time.toLocaleTimeString();
  const action = msg.a
  const data = msg.d

  switch(action) {
    case "ping":
      handlePong();
      break;
    case "heading":
      handleHeading(data.title, data.body, data.icon);
      break;
    case "multipleChoiceQuestion":
      handleMultipleChoiceQuestion(data.question, data.answers);
      break;
    default:
      console.error("Unknown message action: %s", action);
      break;
  }
};
