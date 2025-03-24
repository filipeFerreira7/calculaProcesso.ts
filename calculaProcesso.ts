import * as readline from "readline-sync";

interface Process {
    id: string;
    at: number; //  arrival time
    bt: number; //  burst Time
    ct?: number; // completion Time
    tat?: number;// turnaround Time
    wt?: number; // waiting Time
    remainingTime?: number; // tempo restante p RR
}

function getProcessesFromUser(): Process[] {
    const processes: Process[] = [];
    const numProcesses = Number(readline.question("Insira a quantidade de processos: "));

    for (let i = 0; i < numProcesses; i++) {
        const at = Number(readline.question(`Insira o tempo de chegada (AT) do processo P${i + 1}: `));
        const bt = Number(readline.question(`Insira o tempo de execucao (BT) do processo P${i + 1}: `));
        processes.push({ id: `P${i + 1}`, at, bt });
    }
    return processes;
}

function calculateTimes(processes: Process[]): void {
    let totalTAT = processes.reduce((sum, p) => sum + (p.tat || 0), 0);
    let totalWT = processes.reduce((sum, p) => sum + (p.wt || 0), 0);

    console.log("\nNome | AT | BT | CT | TAT | WT");
    processes.forEach(p => {
        console.log(`${p.id}        | ${p.at}  | ${p.bt}  | ${p.ct}  | ${p.tat}  | ${p.wt}`);
    });

    console.log(`\nTempo médio de TAT: ${(totalTAT / processes.length).toFixed(2)}`);
    console.log(`Tempo médio de WT: ${(totalWT / processes.length).toFixed(2)}`);
}

// FCFS
function fcfsScheduling(processes: Process[]): void {
    processes.sort((a, b) => a.at - b.at);
    let currentTime = 0;
    
    processes.forEach((process) => {
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
function sjfScheduling(processes: Process[]): void {
    processes.sort((a, b) => a.at - b.at);
    let completed: Process[] = [];
    let readyQueue: Process[] = [];
    let currentTime = 0;

    while (completed.length < processes.length) {
        readyQueue = processes.filter(p => p.at <= currentTime && !completed.includes(p));

        if (readyQueue.length === 0) {
            currentTime = Math.min(...processes.filter(p => !completed.includes(p)).map(p => p.at));
            continue;
        }

        readyQueue.sort((a, b) => a.bt - b.bt);
        let process = readyQueue[0];

        process.ct = currentTime + process.bt;
        process.tat = process.ct - process.at;
        process.wt = process.tat - process.bt;
        currentTime = process.ct;
        
        completed.push(process);
    }

    console.log("\nEscalonamento SJF:");
    calculateTimes(completed);
}

// Algoritmo Round Robin (RR)
function roundRobinScheduling(processes: Process[], quantum: number): void {
    let queue: Process[] = [];
    let currentTime = 0;
    let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.bt }));

    while (remainingProcesses.length > 0) {
        let process = remainingProcesses.shift();
        
        if (process) {
            if (currentTime < process.at) {
                currentTime = process.at;
            }

            let executionTime = Math.min(process.remainingTime!, quantum);
            currentTime += executionTime;
            process.remainingTime! -= executionTime;

            if (process.remainingTime! > 0) {
                remainingProcesses.push(process);
            } else {
                process.ct = currentTime;
                process.tat = process.ct - process.at;
                process.wt = process.tat - process.bt;
                queue.push(process);
            }
        }
    }

    console.log("\nEscalonamento Round Robin:");
    calculateTimes(queue);
}


const processes = getProcessesFromUser();
const quantum = Number(readline.question("Insira o quantum para Round Robin: "));

//chamada de exec
fcfsScheduling([...processes]);
sjfScheduling([...processes]);   
roundRobinScheduling([...processes], quantum);
