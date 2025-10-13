(* ::Package:: *)

g = PolyhedronData["SnubCube", "Skeleton"];
group = GroupElements[GraphAutomorphismGroup[g]];
CanonicalPolyform[{p1_, p2_, p3_}] := 
  CanonicalPolyform[{p1, p2, p3}] = MinimalBy[
    Table[Map[
      Sort[PermutationReplace[#, perm]] &, 
      Polyform[{p1, p2, p3}]
    ], {perm, group}], 
    Identity
  ][[1]];
GetCanonicalPolyforms[vertexList_] := CanonicalPolyform /@ Union[Partition[vertexList, 3]]
ExistingPolyforms[vertexList_] := GetCanonicalPolyforms[
  Switch[Mod[Length[vertexList], 3],
    0, vertexList[[1 ;; -4]],
    1, vertexList[[1 ;; -2]],
    2, vertexList[[1 ;; -3]]
  ]
]
IsConnected[Polyform[{p1_}]] := True
IsConnected[Polyform[{p1_, p2_}]] := AnyTrue[
  Range[p2 + 1, 24], 
  IsConnected[Polyform[{p1, p2, #}]] &
]

IsConnected[Polyform[{p1_, p2_, p3_}]] := Or[
  EdgeQ[g, p1 \[UndirectedEdge] p2] && EdgeQ[g, p1 \[UndirectedEdge] p3],
  EdgeQ[g, p1 \[UndirectedEdge] p2] && EdgeQ[g, p2 \[UndirectedEdge] p3],
  EdgeQ[g, p1 \[UndirectedEdge] p3] && EdgeQ[g, p2 \[UndirectedEdge] p3]
]

CurrentPolyform[vertexList_] := Polyform[
  Switch[Mod[Length[vertexList], 3],
    0, vertexList[[-3 ;; -1]],
    1, vertexList[[-1 ;; -1]],
    2, vertexList[[-2 ;; -1]]
  ]
]

IsValid[vertexList_] := Module[{vs},
  vs = CurrentPolyform[vertexList];
  If[Mod[Length @@ vs, 3] != 0,
    IsConnected[vs],
    IsConnected[vs] && Not[MemberQ[
      ExistingPolyforms[vertexList], 
      CanonicalPolyform @@ vs
    ]]
  ]
]
NextThing[vertexList_, index_] := 
  SelectFirst[
    Range[vertexList[[index]] + 1, 24], 
    Not[MemberQ[vertexList, #]] &
  ]

(* Idea: delete the last thing, and increment the thing before it. *)
Backtrack[vertexList_] := Module[{nextLetter},
  nextLetter = NextThing[vertexList, -2];
  If[MissingQ[nextLetter],
     Backtrack[vertexList[[1 ;; -2]]],
    Append[vertexList[[1 ;; -3]], nextLetter]
  ]
]
NextStateValid[vertexList_] := Module[{nextLetter},
  If[Mod[Length[vertexList], 3] == 0,
    nextLetter = NextThing[vertexList, -3],
    nextLetter = NextThing[vertexList, -1]
  ];
  If[MissingQ[nextLetter],
    Backtrack[vertexList],
    Append[vertexList, nextLetter]
  ]
]
NextStateInvalid[vertexList_] := Module[{nextLetter},
  nextLetter = NextThing[vertexList, -1];
  If[MissingQ[nextLetter],
    Backtrack[vertexList],
    Append[vertexList[[1 ;; -2]], nextLetter]
  ]
]

Timing[
 vertexState = {1};
 inProcess = True;
 c = 1;
 While[Length[vertexState] < 24 || Not[IsValid[vertexState]],
    If[Mod[c, 100000] == 0, Print[Length[vertexState], vertexState]];
    If[IsValid[vertexState],
      vertexState = NextStateValid[vertexState],
      vertexState = NextStateInvalid[vertexState]
    ]
  ];
  Print[vertexState]
]
