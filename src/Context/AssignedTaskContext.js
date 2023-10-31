import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { AuthRequest } from '../services/AuthRequest';



const AssignedTaskContext = createContext({})

const AssignedTask = ({ children }) => {

    let user = JSON.parse(localStorage.getItem('user'))


    const { isLoading: assignedTaskLoading, refetch: fetchAssignedTask, data: assignedTask } = useQuery(`assignedTask-${user.id}`,
        async () => {
            return AuthRequest.get(`/api/v1/dme/assign-task/assignedTo/${user.id}`,).then(data => data.data.data)
        }
    )

    const { isLoading: assignedByTaskLoading, refetch: fetchAssignedByTask, data: assignedByTask } = useQuery(`assignedByTask-${user.id}`,
        async () => {
            return AuthRequest.get(`/api/v1/dme/assign-task/assignedBy/${user.id}`,).then(data => data.data.data)
        }
    )

    const { isLoading: PendingAssignedTaskLoading, refetch: fetchPendingAssignedTask, data: pendingAssignedTask } = useQuery(`pendingTask-${user.id}`,
        async () => {
            return AuthRequest.get(`/api/v1/dme/assign-task/assignedTo/pending/${user.id}`,).then(data => data.data.data)
        }
    )



    const data = {
        assignedTaskLoading,
        assignedTask,
        fetchAssignedTask,
        assignedByTaskLoading,
        assignedByTask,
        fetchAssignedByTask,
        PendingAssignedTaskLoading,
        fetchPendingAssignedTask,
        pendingAssignedTask
    }


    return (
        <AssignedTaskContext.Provider value={data} >
            {children}
        </AssignedTaskContext.Provider>
    );
};


const useAssignedTaskContext = () => {
    const useAssignedTask = useContext(AssignedTaskContext)
    return useAssignedTask
}



export { AssignedTask, useAssignedTaskContext }
