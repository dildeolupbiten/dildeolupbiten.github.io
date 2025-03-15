function max(array) {
    var m = array[0];
    var index = 0;
    for (var i = 1; i < 4; i++) {
        if (m < array[i]) {
            m = array[i];
            index = i;
        }
    }
    return index;
}

function chooseAction(agent, snake, epsilon) {
    if (Math.random() < epsilon) {
        snake.action = Math.floor(4 * Math.random());
        snake.key = agent.getKey(snake);
        agent.setKey(snake.key);
    } else {
        snake.key = agent.getKey(snake);
        agent.setKey(snake.key);
        snake.action = max(agent.table[snake.key]);
    }
}

function penaltyForObstacleCollision(snake) {
    if (snake.directions[snake.action] === -2) {
        snake.done = 1;
        return -2;
    }
    return 0;
}

function rewardForTargetCollision(snake) {
    snake.increaseBody();
    if (snake.directions[snake.action] == 2) {
        snake.setTarget();
        return 2;
    }
    snake.decreaseBody();
    return 0;
}

function penaltyForDangerousAction(snake) {
    if (snake.directions[snake.action] == -1) {
        return -1;
    }
    return 0;
}

function getReward(snake) {
    var reward = 0;
    reward += penaltyForObstacleCollision(snake);
    if (snake.done) {
        return reward;
    }
    reward += rewardForTargetCollision(snake);
    reward += penaltyForDangerousAction(snake);
    return reward;
}

function qAlgorithm(current_q, max_next_q, reward, learning_rate, discount_factor) {
    var next_q = reward + discount_factor * max_next_q;
    return (1 - learning_rate) * current_q + learning_rate * next_q;
}

function updateQValue(agent, snake, next_key, reward, learning_rate, discount_factor) {
    var current_q = agent.table[snake.key][snake.action];
    var max_next_q = agent.table[next_key][max(agent.table[next_key])];
    var new_q = qAlgorithm(current_q, max_next_q, reward, learning_rate, discount_factor);
    agent.table[snake.key][snake.action] = new_q;
}

function playSnake(agent, snake, learning_rate, discount_factor, epsilon, ctx, play) {
    snake.reset();
    function step() {
        if (snake.done) {
            snake.loop = false;
            return;
        }
        chooseAction(agent, snake, epsilon);
        var reward = getReward(snake);
        var next_key = agent.getKey(snake);
        agent.setKey(next_key);
        updateQValue(agent, snake, next_key, reward, learning_rate, discount_factor);
        if (play) {
            snake.printGrid(ctx);
            ctx.avg_size.innerHTML = snake.body.length;
            setTimeout(step, 100);
        }
    }
    if (play) {
        step();
    } else {
        while (!snake.done) {
            step();
        }
    }
}

function trainSnake(agent, snake, learning_rate, discount_factor, epsilon, episodes, pbar, ctx, play) {
    var avg_size = 0;
    var episode = 0;
    function nextEpisode() {
        if (episode >= episodes) {
            snake.loop = false;
            return;
        }
        if (!snake.loop) {
            return;
        }
        snake.reset();
        playSnake(agent, snake, learning_rate, discount_factor, epsilon, ctx, play);
        pbar.setAttribute("aria-valuenow", episode + 1);
        pbar.style.width = `${(episode + 1) / episodes * 100}%`;
        pbar.innerHTML = `${(episode + 1) / episodes * 100}%`;
        avg_size += (snake.body.length - avg_size) / (episode + 1);
        pbar.avg_size.innerHTML = Math.round(avg_size * 1000000) / 1000000;
        episode++;
        setTimeout(nextEpisode, 0);
    }
    nextEpisode();
}
