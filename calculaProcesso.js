"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline-sync");
function getProcessesFromUser() {
    var processes = [];
    var numProcesses = Number(readline.question("Insira a quantidade de processos: "));
    for (var i = 0; i < numProcesses; i++) {
        var at = Number(readline.question("Insira o tempo de chegada (AT) do processo P".concat(i + 1, ": ")));
        var bt = Number(readline.question("Insira o tempo de execucao (BT) do processo P".concat(i + 1, ": ")));
        processes.push({ id: "P".concat(i + 1), at: at, bt: bt });
    }
    return processes;
}
function calculateTimes(processes) {
    var totalTAT = processes.reduce(function (sum, p) { return sum + (p.tat || 0); }, 0);
    var totalWT = processes.reduce(function (sum, p) { return sum + (p.wt || 0); }, 0);
    console.log("\nNome | AT | BT | CT | TAT | WT");
    processes.forEach(function (p) {
        console.log("".concat(p.id, "        | ").concat(p.at, "  | ").concat(p.bt, "  | ").concat(p.ct, "  | ").concat(p.tat, "  | ").concat(p.wt));
    });
    console.log("\nTempo m\u00E9dio de TAT: ".concat((totalTAT / processes.length).toFixed(2)));
    console.log("Tempo m\u00E9dio de WT: ".concat((totalWT / processes.length).toFixed(2)));
}
// FCFS
function fcfsScheduling(processes) {
    processes.sort(function (a, b) { return a.at - b.at; });
    var currentTime = 0;
    processes.forEach(function (process) {
        if (currentTime < process.at) {
            currentTime = process.at;
        }
        process.ct = currentTime + process.bt;
        process.tat = process.ct - process.at;
        process.wt = process.tat - process.bt;
        currentTime = process.ct;
    });
    console.log("\nEscalonamento FCFS:");
    calculateTimes(processes);
}
// Algoritmo SJF sem preempção
function sjfScheduling(processes) {
    processes.sort(function (a, b) { return a.at - b.at; });
    var completed = [];
    var readyQueue = [];
    var currentTime = 0;
    while (completed.length < processes.length) {
        readyQueue = processes.filter(function (p) { return p.at <= currentTime && !completed.includes(p); });
        if (readyQueue.length === 0) {
            currentTime = Math.min.apply(Math, processes.filter(function (p) { return !completed.includes(p); }).map(function (p) { return p.at; }));
            continue;
        }
        readyQueue.sort(function (a, b) { return a.bt - b.bt; });
        var process_1 = readyQueue[0];
        process_1.ct = currentTime + process_1.bt;
        process_1.tat = process_1.ct - process_1.at;
        process_1.wt = process_1.tat - process_1.bt;
        currentTime = process_1.ct;
        completed.push(process_1);
    }
    console.log("\nEscalonamento SJF:");
    calculateTimes(completed);
}
// Algoritmo Round Robin (RR)
function roundRobinScheduling(processes, quantum) {
    var queue = [];
    var currentTime = 0;
    var remainingProcesses = processes.map(function (p) { return (__assign(__assign({}, p), { remainingTime: p.bt })); });
    while (remainingProcesses.length > 0) {
        var process_2 = remainingProcesses.shift();
        if (process_2) {
            if (currentTime < process_2.at) {
                currentTime = process_2.at;
            }
            var executionTime = Math.min(process_2.remainingTime, quantum);
            currentTime += executionTime;
            process_2.remainingTime -= executionTime;
            if (process_2.remainingTime > 0) {
                remainingProcesses.push(process_2);
            }
            else {
                process_2.ct = currentTime;
                process_2.tat = process_2.ct - process_2.at;
                process_2.wt = process_2.tat - process_2.bt;
                queue.push(process_2);
            }
        }
    }
    console.log("\nEscalonamento Round Robin:");
    calculateTimes(queue);
}
var processes = getProcessesFromUser();
var quantum = Number(readline.question("Insira o quantum para Round Robin: "));
//chamada de exec
fcfsScheduling(__spreadArray([], processes, true));
sjfScheduling(__spreadArray([], processes, true));
roundRobinScheduling(__spreadArray([], processes, true), quantum);
