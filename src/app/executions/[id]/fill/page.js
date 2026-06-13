"use client";

import { useEffect, useState } from "react";

export default function FillExecution({ params }) {
  const [execution, setExecution] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const loadExecution = async () => {
      const res = await fetch(
        `/api/executions/${params.id}`
      );

      const data = await res.json();

      setExecution(data);
      setResponses(data.responses || {});
    };

    loadExecution();
  }, [params.id]);

  const handleResponseChange = (itemId, value) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        value,
        valid: true,
        visible: true,
        completedAt: new Date().toISOString(),
      },
    }));
  };

  const handleSubmit = async () => {
    await fetch(`/api/executions/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        responses,
        status: "completed",
        completedAt: new Date().toISOString(),
      }),
    });

    alert("Ejecución completada");
  };

  if (!execution) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{execution.checklistTitle}</h1>

      {execution.checklist.items.map((item) => (
        <div key={item._id}>
          <label>{item.question}</label>

          <input
            type="text"
            onChange={(e) =>
              handleResponseChange(
                item._id,
                e.target.value
              )
            }
          />
        </div>
      ))}

      <button onClick={handleSubmit}>
        Finalizar ejecución
      </button>
    </div>
  );
}