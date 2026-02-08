import React, { createContext, useContext } from 'react';

interface RouteTransitionContextValue {
  isPending: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue>({ isPending: false });

export const RouteTransitionProvider: React.FC<{ isPending: boolean; children: React.ReactNode }> = ({ isPending, children }) => {
  return (
    <RouteTransitionContext.Provider value={{ isPending }}>
      {children}
    </RouteTransitionContext.Provider>
  );
};

export const useRouteTransition = () => useContext(RouteTransitionContext);
