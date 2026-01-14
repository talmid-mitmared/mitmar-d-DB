In this RES-17, maybe use chunk, chunk-sub to prevent the huge code size per PR

- [ ] First, add debuggig logic to make it easier to debug(Js is high level language -> hard to debug. has to write a code for this). If above easily doesn't work think about the adding the more properties in node. actually btw we dont have to make page interface like exactly same as btree page. Maybe also add local html to show debug with UI????
- [ ] Second, maybe add strict object freeze on the object in the current page to keep the immutability
- [ ] Third, add workingInProgress logic like react fiber code to keep original data safe
- [ ] Fourth, Revise the insertion test code. THE TEST CODE IS GARBAGE.
