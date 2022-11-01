// utils
function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length
}

function getRandomInt(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

// errors
function parse_error(stack_a, stack_b) {
	stack_a.innerHTML = ""
	var li = document.createElement("li")
	li.textContent = "error"
	stack_a.append(li)
}

// events
document.getElementById("stack_input").onkeydown = function(event) {
	if (event.key == "Enter") {
		var stack_a = document.getElementById("stack_a")
		var stack_b = document.getElementById("stack_b")
		var history = document.getElementById("history")
		var text = document.getElementById("stack_input").value
		var split;
		var li;

		stack_a.innerHTML = ""
		stack_b.innerHTML = ""
		history.innerHTML = ""
		li = document.createElement("li")
		li.textContent = "Total: 0"
		history.append(li)
		split = text.split(' ')
		if (checkIfDuplicateExists(split)) {
			parse_error(stack_a, stack_b)
			return
		}
		for (const el of split) {
			if (isNaN(parseInt(el))) {
				parse_error(stack_a, stack_b)
				return
			} else {
				li = document.createElement("li")
				li.textContent = el
				stack_a.append(li)
			}
		}
    }
}

document.onkeydown = function(event) {
	if (event.key == 'z' && event.ctrlKey)
	{
		var history = document.getElementById("history")

		if (history.childElementCount > 1)
			switch (history.children[1].innerText) {
				case "sa":
					sa(true)
					break
				case "sb":
					sb(true)
					break
				case "ss":
					ss(true)
					break
				case "pa":
					pb(true)
					break
				case "pb":
					pa(true)
					break
				case "ra":
					rra(true)
					break
				case "rb":
					rrb(true)
					break
				case "rr":
					rrr(true)
					break
				case "rra":
					ra(true)
					break
				case "rrb":
					rb(true)
					break
				case "rrr":
					rr(true)
					break
				default:
					console.error("History error: this command doesn't exist.")
			}
	}
}

function updateRange(select) {
	if (select.value == "range")
		document.getElementsByClassName("range")[0].style.display = "flex"
	else
		document.getElementsByClassName("range")[0].style.display = "none"
}

function switch_popup() {
	var popup = document.getElementById("generate_popup")

	if (popup.style.display == "none" || popup.style.display == "")
		popup.style.display = "flex"
	else
		popup.style.display = "none"
}

function generate_numbers() {
	var select = document.getElementsByClassName("select_type")[0]
	var size = parseInt(document.getElementsByClassName("size")[0].value)

	result = []
	if (!isNaN(size) && size >= 1 && size <= 1000)
	{
		if (select.value == "random") {
			var tmp

			for (let i = 0 ; i < size ; i++) {
				tmp = getRandomInt(-2147483648, 2147483647)
				if (result.includes(tmp))
					i--
				else
					result.push(tmp)
			}
			document.getElementById("stack_input").value = result.join(' ')
			switch_popup()
		}
		else if (select.value == "range") {
			var min_range = parseInt(document.getElementsByClassName("min_range")[0].value)
			var max_range = parseInt(document.getElementsByClassName("max_range")[0].value)

			if (!isNaN(min_range) && !isNaN(max_range) && min_range <= max_range && max_range - min_range + 1 >= size) {
				for (let i = 0 ; i < size ; i++) {
					tmp = getRandomInt(min_range, max_range)
					if (result.includes(tmp))
						i--
					else
						result.push(tmp)
				}
				document.getElementById("stack_input").value = result.join(' ')
				switch_popup()
			}
		}
	}
}

function import_history()
{
	var text = window.prompt("History:","commands")

	if (text)
		for (const el of text.split(' ')) {
			window[el]()
		}
}

// commands
function command(func) {
	return function(is_undo = false) {
		var history = document.getElementById("history")

		if (!func(document.getElementById("stack_a"), document.getElementById("stack_b")))
			return
		if (is_undo)
		{
			history.children[0].innerText = "Total: " + (parseInt(history.children[0].innerText.slice(7)) - 1)
			history.removeChild(history.children[1])
		}
		else
		{
			history.children[0].innerText = "Total: " + (parseInt(history.children[0].innerText.slice(7)) + 1)
			var li = document.createElement("li")
			li.textContent = func.name
			if (history.childElementCount > 1)
				history.insertBefore(li, history.children[1])
			else
				history.append(li)
		}
	}
}

function sa(stack_a, stack_b)
{
	if (stack_a.childElementCount < 2)
		return false
	var tmp = stack_a.children[0].textContent
	stack_a.children[0].textContent = stack_a.children[1].textContent
	stack_a.children[1].textContent = tmp
	return true
}

function sb(stack_a, stack_b)
{
	if (stack_b.childElementCount < 2)
		return false
	var tmp = stack_b.children[0].textContent
	stack_b.children[0].textContent = stack_b.children[1].textContent
	stack_b.children[1].textContent = tmp
	return true
}

function ss(stack_a, stack_b)
{
	var tmp

	if (stack_a.childElementCount < 2 || stack_b.childElementCount < 2)
		return false
	tmp = stack_a.children[0].textContent
	stack_a.children[0].textContent = stack_a.children[1].textContent
	stack_a.children[1].textContent = tmp
	tmp = stack_b.children[0].textContent
	stack_b.children[0].textContent = stack_b.children[1].textContent
	stack_b.children[1].textContent = tmp
	return true
}

function pa(stack_a, stack_b)
{
	if (stack_b.childElementCount == 0)
		return false
	if (stack_a.childElementCount > 0)
		stack_a.insertBefore(stack_b.children[0], stack_a.children[0])
	else
		stack_a.append(stack_b.children[0])
	return true
}

function pb(stack_a, stack_b)
{
	if (stack_a.childElementCount == 0)
		return false
	if (stack_b.childElementCount > 0)
		stack_b.insertBefore(stack_a.children[0], stack_b.children[0])
	else
		stack_b.append(stack_a.children[0])
	return true
}

function ra(stack_a, stack_b)
{
	if (stack_a.childElementCount > 1)
		stack_a.append(stack_a.children[0])
	return true
}

function rb(stack_a, stack_b)
{
	if (stack_b.childElementCount > 1)
		stack_b.append(stack_b.children[0])
	return true
}

function rr(stack_a, stack_b)
{
	if (stack_a.childElementCount > 1)
		stack_a.append(stack_a.children[0])
	if (stack_b.childElementCount > 1)
		stack_b.append(stack_b.children[0])
	return true
}

function rra(stack_a, stack_b)
{
	if (stack_a.childElementCount > 1)
		stack_a.insertBefore(stack_a.lastChild, stack_a.children[0])
	return true
}

function rrb(stack_a, stack_b)
{
	if (stack_b.childElementCount > 1)
		stack_b.insertBefore(stack_b.lastChild, stack_b.children[0])
	return true
}

function rrr(stack_a, stack_b)
{
	if (stack_a.childElementCount > 1)
		stack_a.insertBefore(stack_a.lastChild, stack_a.children[0])
	if (stack_b.childElementCount > 1)
		stack_b.insertBefore(stack_b.lastChild, stack_b.children[0])
	return true
}

sa = command(sa)
sb = command(sb)
ss = command(ss)
pa = command(pa)
pb = command(pb)
ra = command(ra)
rb = command(rb)
rr = command(rr)
rra = command(rra)
rrb = command(rrb)
rrr = command(rrr)

updateRange(document.getElementsByClassName("select_type")[0])
